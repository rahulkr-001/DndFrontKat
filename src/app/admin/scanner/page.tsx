'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Camera,
  CameraOff,
  SwitchCamera,
  Zap,
  ZapOff,
  RefreshCw,
  Volume2,
  VolumeX,
  ArrowLeft,
  Loader2,
  Upload,
} from 'lucide-react';
import { DandiyaLogo } from '@/components/common/DandiyaLogo';

export default function GateScannerPage() {
  const [scannedToken, setScannedToken] = useState('');
  const [selectedGate, setSelectedGate] = useState('Main Gate - Entrance');
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [admittedCount, setAdmittedCount] = useState(0);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Camera Scanner States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isScanningPaused, setIsScanningPaused] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Web Audio Synthetic Sound Generator + Haptics
  const playSoundAndVibrate = (type: 'SUCCESS' | 'ERROR') => {
    // Haptic feedback for mobile phones
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'SUCCESS') {
        navigator.vibrate([80, 40, 80]);
      } else {
        navigator.vibrate([250]);
      }
    }

    if (!audioFeedback) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'SUCCESS') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
        osc.frequency.setValueAtTime(164.81, audioCtx.currentTime + 0.15); // E3
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {}
  };

  const handleValidateToken = async (tokenToTest?: string) => {
    const rawToken = tokenToTest || scannedToken;
    if (!rawToken.trim()) return;

    setIsVerifying(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: rawToken.trim(),
          gateName: selectedGate,
          deviceInfo: `Gate Scanner — ${navigator.userAgent?.slice(0, 80) || 'Mobile Terminal'}`,
        }),
      });

      const data = await res.json();
      setIsVerifying(false);

      // Handle auth errors cleanly
      if (res.status === 401) {
        setScanResult({
          result: 'AUTH_REQUIRED',
          message: 'You must be logged in as staff to use the gate scanner. Please log in at /admin first.',
          admitted: false,
        });
        playSoundAndVibrate('ERROR');
        return;
      }

      if (res.status === 403) {
        setScanResult({
          result: 'FORBIDDEN',
          message: 'Your account does not have gate scanner permissions. Contact the Super Admin.',
          admitted: false,
        });
        playSoundAndVibrate('ERROR');
        return;
      }

      setScanResult(data);

      if (data.result === 'VALID') {
        playSoundAndVibrate('SUCCESS');
        setAdmittedCount((prev) => prev + 1);
      } else {
        playSoundAndVibrate('ERROR');
      }

      setScanHistory((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          result: data.result,
          attendee: data.ticket?.attendeeName || 'Unknown',
          tier: data.ticket?.tierName || 'N/A',
          message: data.message,
        },
        ...prev.slice(0, 19),
      ]);

      setScannedToken('');
      if (inputRef.current) inputRef.current.focus();
    } catch (err: any) {
      setIsVerifying(false);
      playSoundAndVibrate('ERROR');
      setScanResult({
        result: 'ERROR',
        message: err.message || 'Network error: cannot reach the gate validation server.',
        admitted: false,
      });
    }
  };


  // Start Camera Stream
  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    setCameraError(null);

    // Mobile browsers require HTTPS (or localhost) for camera access
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setCameraError(
        'Camera requires a secure connection (HTTPS). On mobile, open this page via HTTPS or use localhost. HTTP is not supported for camera access.'
      );
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'Camera API not supported in this browser. Use Chrome on Android or Safari 17+ on iPhone.'
      );
      return;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities: any = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
        setHasTorch(Boolean(capabilities.torch));
      }

      setIsCameraActive(true);
      startScanLoop();
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. In Chrome: tap the lock icon in the address bar → Site settings → Camera → Allow. In Safari: Settings → Safari → Camera → Allow.'
          : err.name === 'NotFoundError'
          ? 'No camera found on this device.'
          : err.name === 'OverconstrainedError'
          ? 'Camera constraints could not be satisfied. Try switching camera mode.'
          : `Camera error: ${err.message || err.name}`
      );
    }
  };


  // Stop Camera Stream
  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
  };

  // Toggle Torch / Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
      } catch (e) {
        console.error('Torch error:', e);
      }
    }
  };

  // Switch between front and back camera
  const switchCamera = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  // Use a ref to handleValidateToken to avoid stale closures inside requestAnimationFrame
  const handleValidateTokenRef = useRef(handleValidateToken);
  useEffect(() => {
    handleValidateTokenRef.current = handleValidateToken;
  });

  // Real-time Barcode / QR Detection Loop
  // Uses native BarcodeDetector (Android Chrome / iOS Safari 17+) with jsQR canvas fallback
  const scanFrame = useCallback(async () => {
    if (!isCameraActive || isScanningPaused || !videoRef.current || !canvasRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameRef.current = requestAnimationFrame(scanFrame);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      let detectedValue: string | null = null;

      try {
        // Path 1: Native BarcodeDetector API (Android Chrome, iOS Safari 17+)
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await detector.detect(video);
          if (barcodes.length > 0 && barcodes[0].rawValue) {
            detectedValue = barcodes[0].rawValue;
          }
        }
      } catch {
        // Native detector failed or unsupported, fall through to jsQR
      }

      // Path 2: jsQR canvas fallback (Firefox, older browsers without BarcodeDetector)
      if (!detectedValue) {
        try {
          const { default: jsQR } = await import('jsqr');
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          if (code?.data) {
            detectedValue = code.data;
          }
        } catch {
          // jsQR not available or failed — continue
        }
      }

      if (detectedValue) {
        setIsScanningPaused(true);
        // Use ref to avoid stale closure capturing old handleValidateToken
        await handleValidateTokenRef.current(detectedValue);
        // Resume scanning after 2 seconds to prevent duplicate scans
        setTimeout(() => {
          setIsScanningPaused(false);
        }, 2000);
        return;
      }
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [isCameraActive, isScanningPaused]);

  const startScanLoop = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    if (isCameraActive && !isScanningPaused) {
      startScanLoop();
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive, isScanningPaused, scanFrame]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);


  // Handle Photo Upload QR Detection Fallback
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be uploaded again
    e.target.value = '';

    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;
      img.onload = async () => {
        let detectedValue: string | null = null;

        // Try native BarcodeDetector first
        if ('BarcodeDetector' in window) {
          try {
            const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await detector.detect(img);
            if (barcodes.length > 0 && barcodes[0].rawValue) {
              detectedValue = barcodes[0].rawValue;
            }
          } catch {}
        }

        // jsQR canvas fallback
        if (!detectedValue) {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const { default: jsQR } = await import('jsqr');
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              });
              if (code?.data) detectedValue = code.data;
            }
          } catch {}
        }

        URL.revokeObjectURL(objectUrl);

        if (detectedValue) {
          handleValidateToken(detectedValue);
        } else {
          alert('Could not decode a QR code from this image. Try a clearer photo or enter the ticket token manually below.');
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        alert('Could not load the uploaded image. Please try another file.');
      };
    } catch (err) {
      console.error('Photo decode error:', err);
    }
  };


  return (
    <div className="min-h-screen bg-[#070208] text-white flex flex-col font-sans">
      {/* Gatekeeper Bar */}
      <header className="bg-[#120719] border-b border-[#D4AF37]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center space-x-2">
            <DandiyaLogo className="w-6 h-6" />
            <div>
              <h1 className="font-serif font-bold text-sm text-[#F7E7A9] flex items-center space-x-1.5">
                <span>Gate Admission Scanner</span>
              </h1>
              <span className="text-[10px] text-white/50">
                Dandiya Night 3.0 • Mobile Camera Terminal
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="px-3 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#D4AF37]">
            {admittedCount} Admitted
          </div>

          <button
            onClick={() => setAudioFeedback(!audioFeedback)}
            className={`p-2 rounded-lg border text-xs cursor-pointer ${
              audioFeedback ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/10 text-white/40'
            }`}
            title="Toggle Sound"
          >
            {audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Scanner Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 flex flex-col space-y-4">
        {/* Gate Selection Pill */}
        <div className="flex items-center justify-between bg-[#120719] p-3 rounded-2xl border border-white/10 text-xs">
          <span className="text-white/60">Active Gate Station:</span>
          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="bg-[#1A0B2E] text-[#F7E7A9] font-semibold rounded-lg px-3 py-1.5 border border-[#D4AF37]/30 focus:outline-none"
          >
            <option value="Main Gate - Entrance">Main Gate - Entrance</option>
            <option value="VIP & Artists Gate">VIP & Artists Gate</option>
            <option value="West Garden Gate">West Garden Gate</option>
          </select>
        </div>

        {/* MOBILE CAMERA SCANNER VIEWFINDER */}
        <div className="bg-[#120719] border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-white">
                Mobile Camera Scanner
              </span>
            </div>

            {isCameraActive && (
              <div className="flex items-center space-x-2">
                {hasTorch && (
                  <button
                    onClick={toggleTorch}
                    className={`p-1.5 rounded-lg border text-xs ${
                      isTorchOn ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 border-white/10 text-white/70'
                    }`}
                    title="Flashlight"
                  >
                    {isTorchOn ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
                  </button>
                )}
                <button
                  onClick={switchCamera}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-white"
                  title="Switch Front/Back Camera"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Camera View Area */}
          <div className="relative aspect-square max-h-[360px] bg-black flex items-center justify-center overflow-hidden">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none" aria-hidden="true" />

                {/* Reticle / Targeting Box */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                  <div className="w-56 h-56 border-2 border-[#D4AF37] rounded-3xl relative overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    {/* Corner Reticle Accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-xl" />

                    {/* Animated Laser Scanning Beam */}
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-bounce absolute top-0" />
                  </div>
                </div>

                {isScanningPaused && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center p-4">
                      <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-2" />
                      <span className="text-xs font-bold text-[#F7E7A9] uppercase tracking-wider">
                        Verifying Ticket...
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
                  <QrCode className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#F7E7A9]">
                    Camera Scanner Inactive
                  </h3>
                  <p className="text-[11px] text-white/50 max-w-xs mx-auto mt-1">
                    Point your mobile phone camera at attendee QR codes for atomic gate check-in.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls Bar */}
          <div className="p-4 bg-[#0D0614] border-t border-white/10 flex flex-wrap gap-2 justify-center">
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="px-4 py-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs font-bold flex items-center space-x-1.5 hover:bg-red-900 transition-all cursor-pointer"
              >
                <CameraOff className="w-4 h-4" />
                <span>Stop Camera</span>
              </button>
            ) : (
              <button
                onClick={() => startCamera()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Start Mobile Camera</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white text-xs font-medium flex items-center space-x-1 cursor-pointer"
              title="Upload QR Image"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload QR</span>
            </button>
          </div>

          {cameraError && (
            <div className="p-3 bg-red-950 border-t border-red-500 text-red-200 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{cameraError}</span>
            </div>
          )}
        </div>

        {/* Manual Barcode / Token Stream Backup Field */}
        <div className="bg-[#120719] border border-white/10 rounded-2xl p-4 space-y-3">
          <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider flex items-center justify-between">
            <span>Manual Token Input / USB Scanner</span>
            <span className="text-[10px] text-white/50 normal-case">Fallback Mode</span>
          </label>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleValidateToken();
            }}
            className="flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={scannedToken}
              onChange={(e) => setScannedToken(e.target.value)}
              placeholder="Paste token or type ticket number..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              disabled={isVerifying || !scannedToken.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider disabled:opacity-40 hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
            >
              {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate'}
            </button>
          </form>

          {/* Quick Test Shortcuts */}
          <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[10px]">
            <span className="text-white/40 self-center">Test Shortcuts:</span>
            <button
              onClick={() => handleValidateToken('TKT-SEC-MOCK-INVALID')}
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70"
            >
              Test Invalid
            </button>
            <button
              onClick={() => {
                fetch('/api/admin/tickets')
                  .then((r) => r.json())
                  .then((d) => {
                    const issued = d.tickets?.find((t: any) => t.status === 'ISSUED');
                    if (issued) handleValidateToken(issued.validationToken);
                  });
              }}
              className="px-2 py-1 rounded bg-[#D4AF37]/20 text-[#F7E7A9] hover:bg-[#D4AF37]/30"
            >
              Test Next Issued Ticket
            </button>
          </div>
        </div>

        {/* Big Admission Feedback Card */}
        {scanResult && (
          <div
            className={`p-6 rounded-3xl border-2 shadow-2xl transition-all duration-300 ${
              scanResult.result === 'VALID'
                ? 'bg-emerald-950/90 border-emerald-500 shadow-emerald-900/40 text-emerald-100'
                : scanResult.result === 'ALREADY_USED'
                ? 'bg-red-950/90 border-red-500 shadow-red-900/40 text-red-100'
                : 'bg-amber-950/90 border-amber-500 shadow-amber-900/40 text-amber-100'
            }`}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  scanResult.result === 'VALID'
                    ? 'bg-emerald-500 text-black'
                    : scanResult.result === 'ALREADY_USED'
                    ? 'bg-red-500 text-white'
                    : 'bg-amber-500 text-black'
                }`}
              >
                {scanResult.result === 'VALID' && <CheckCircle2 className="w-8 h-8" />}
                {scanResult.result === 'ALREADY_USED' && <XCircle className="w-8 h-8" />}
                {scanResult.result !== 'VALID' && scanResult.result !== 'ALREADY_USED' && (
                  <AlertTriangle className="w-8 h-8" />
                )}
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold opacity-80 block">
                  Scan Verification Status
                </span>
                <h2 className="font-serif text-2xl font-black">
                  {scanResult.result === 'VALID'
                    ? 'ENTRY APPROVED'
                    : scanResult.result === 'ALREADY_USED'
                    ? 'ALREADY USED'
                    : scanResult.result}
                </h2>
              </div>
            </div>

            <p className="text-sm font-medium mb-4 leading-snug">{scanResult.message}</p>

            {/* Attendee Details if Available */}
            {scanResult.ticket && (
              <div className="bg-black/30 rounded-2xl p-4 space-y-2 text-xs border border-white/10">
                <div className="flex justify-between">
                  <span className="opacity-70">Passholder:</span>
                  <span className="font-bold text-white text-sm">
                    {scanResult.ticket.attendeeName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Category:</span>
                  <span className="font-bold text-[#F7E7A9]">
                    {scanResult.ticket.tierName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Ticket Ref:</span>
                  <span className="font-mono text-white">
                    {scanResult.ticket.ticketNumber}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Gate Scan Log Stream */}
        <div className="bg-[#120719] border border-white/10 rounded-2xl p-4 flex-1 flex flex-col">
          <h3 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-3">
            Recent Gatekeeper Scans
          </h3>

          <div className="space-y-2 overflow-y-auto flex-1 max-h-60 pr-1 text-xs">
            {scanHistory.length === 0 ? (
              <div className="text-center py-6 text-white/40 text-xs">
                Waiting for mobile camera scans...
              </div>
            ) : (
              scanHistory.map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-[#090308] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block">{h.attendee}</span>
                    <span className="text-[10px] text-white/50">
                      {h.tier} • {h.timestamp}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      h.result === 'VALID'
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-red-950 text-red-400'
                    }`}
                  >
                    {h.result}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
