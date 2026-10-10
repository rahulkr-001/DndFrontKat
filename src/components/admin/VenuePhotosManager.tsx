'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { proxyImageUrl } from '@/lib/utils/imageUrl';

interface VenuePhoto {
  id: string;
  venueId: string;
  imageUrl: string;
  title: string | null;
  caption: string | null;
  altText: string | null;
  orderIndex: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export function VenuePhotosManager() {
  const [photos, setPhotos] = useState<VenuePhoto[]>([]);
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Photo Form Modal / Drawer State
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newAltText, setNewAltText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [newOrderIndex, setNewOrderIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchVenuePhotos = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/venue-photos');
      const data = await res.json();
      if (res.ok) {
        setPhotos(data.photos || []);
        setVenue(data.venue || null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to fetch venue photos' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error communicating with server' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenuePhotos();
  }, []);

  // Upload photo file via official Cloudinary upload pipeline
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'dandiya_venue');

    try {
      const res = await fetch('/api/admin/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok && data.url) {
        setNewImageUrl(data.url);
        if (!newTitle) {
          setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }
        setMessage({ type: 'success', text: `Image uploaded successfully via ${data.provider}!` });
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (err: any) {
      setUploading(false);
      setMessage({ type: 'error', text: err.message || 'Upload communication error' });
    }
  };

  // Add Photo to Venue
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) {
      alert('Please upload an image or provide an image URL');
      return;
    }

    if (!venue?.id) {
      alert('No active venue found to link photo to');
      return;
    }

    setUploading(true);
    try {
      const res = await fetch('/api/admin/venue-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: venue.id,
          imageUrl: newImageUrl.trim(),
          title: newTitle.trim() || undefined,
          caption: newCaption.trim() || undefined,
          altText: newAltText.trim() || undefined,
          orderIndex: Number(newOrderIndex) || photos.length,
          isFeatured: newIsFeatured,
          isPublished: true,
        }),
      });

      const data = await res.json();
      setUploading(false);

      if (res.ok) {
        setMessage({ type: 'success', text: 'Venue photo successfully added!' });
        setNewImageUrl('');
        setNewTitle('');
        setNewCaption('');
        setNewAltText('');
        setNewIsFeatured(false);
        fetchVenuePhotos();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add venue photo' });
      }
    } catch (err: any) {
      setUploading(false);
      setMessage({ type: 'error', text: err.message || 'Failed to communicate with server' });
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (photo: VenuePhoto) => {
    try {
      const res = await fetch('/api/admin/venue-photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: photo.id,
          isFeatured: !photo.isFeatured,
        }),
      });

      if (res.ok) {
        fetchVenuePhotos();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reorder photo
  const handleMovePhoto = async (photo: VenuePhoto, direction: 'UP' | 'DOWN') => {
    const newIdx = direction === 'UP' ? Math.max(0, photo.orderIndex - 1) : photo.orderIndex + 1;
    try {
      const res = await fetch('/api/admin/venue-photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: photo.id,
          orderIndex: newIdx,
        }),
      });

      if (res.ok) {
        fetchVenuePhotos();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete photo
  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this venue photo?')) return;
    try {
      const res = await fetch(`/api/admin/venue-photos?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPhotos(photos.filter((p) => p.id !== id));
        setMessage({ type: 'success', text: 'Venue photo removed successfully' });
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete photo');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-3" />
        <span className="text-xs text-white/60">Loading venue photos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
            <Camera className="w-6 h-6 text-[#D4AF37]" />
            <span>Venue Photo & Media Management</span>
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Upload, arrange, and feature high-resolution photos of {venue?.name || 'Indira Garden'} for the public landing page.
          </p>
        </div>

        <button
          onClick={fetchVenuePhotos}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-xs transition-colors self-start cursor-pointer"
        >
          <span>Refresh Photos</span>
        </button>
      </div>

      {/* Status Alert */}
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center space-x-3 ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/60 border-red-500/50 text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Add New Venue Photo Card */}
      <div className="p-6 rounded-3xl bg-[#120719] border border-[#D4AF37]/30 shadow-xl space-y-5">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#8C0B21]/50 text-[#D4AF37] flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Upload New Venue Photo</h3>
            <span className="text-[11px] text-white/60">
              Cloudinary pipeline with automatic optimization and safe local fallback
            </span>
          </div>
        </div>

        <form onSubmit={handleAddPhoto} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Source: File Upload or Direct URL */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Photo Asset
              </label>

              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1A0B2E] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#8C0B21] hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploading ? 'Processing Image...' : 'Upload Image File'}</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] text-white/50 block mb-1">Or paste image URL directly:</span>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Preview Thumbnail */}
              {newImageUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 h-36 bg-black">
                  <img
                    src={proxyImageUrl(newImageUrl)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.svg';
                    }}
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-[#D4AF37]">
                    Preview
                  </div>
                </div>
              )}
            </div>

            {/* Photo Metadata */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Grand Raas Arena Lawn"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="e.g. Spacious garden grass under festive illumination with wide dancing circle"
                  className="w-full px-4 py-2 rounded-xl bg-[#090308] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newOrderIndex}
                    onChange={(e) => setNewOrderIndex(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-xl bg-[#090308] border border-white/15 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsFeatured}
                      onChange={(e) => setNewIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#8C0B21] cursor-pointer"
                    />
                    <span className="text-xs text-white/80 font-semibold">
                      Make Primary Cover
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !newImageUrl}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo to Venue Gallery</span>
          </button>
        </form>
      </div>

      {/* Existing Venue Photos Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-white">
            Current Venue Photos ({photos.length})
          </h3>
          <span className="text-xs text-white/50">
            Drag/order determines arrangement on public event page
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#120719] border border-white/10 text-center space-y-2">
            <ImageIcon className="w-8 h-8 mx-auto text-white/30" />
            <h4 className="text-sm font-semibold text-white">No Venue Photos Added Yet</h4>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              Upload photos of Indira Garden to replace default stock imagery and give attendees a real tour of the festival grounds.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`rounded-3xl bg-[#120719] border overflow-hidden shadow-xl flex flex-col justify-between transition-all ${
                  photo.isFeatured
                    ? 'border-[#D4AF37] shadow-[#D4AF37]/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="relative h-48 bg-black group">
                  <img
                    src={proxyImageUrl(photo.imageUrl)}
                    alt={photo.altText || photo.title || 'Venue Photo'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120719] via-transparent to-transparent" />

                  {photo.isFeatured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#8C0B21] border border-[#D4AF37] text-[#F7E7A9] text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Primary Cover</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center space-x-1">
                    <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] text-white/70 font-mono">
                      #{photo.orderIndex}
                    </span>
                  </div>
                </div>

                {/* Info & Metadata */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white mb-1">
                      {photo.title || 'Untitled Photo'}
                    </h4>
                    {photo.caption && (
                      <p className="text-xs text-white/70 line-clamp-2 font-light">
                        {photo.caption}
                      </p>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleFeatured(photo)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          photo.isFeatured
                            ? 'bg-[#8C0B21] text-[#F7E7A9]'
                            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                        title={photo.isFeatured ? 'Featured cover' : 'Set as featured cover'}
                      >
                        <Star className={`w-4 h-4 ${photo.isFeatured ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleMovePhoto(photo, 'UP')}
                        disabled={idx === 0}
                        className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleMovePhoto(photo, 'DOWN')}
                        disabled={idx === photos.length - 1}
                        className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-200 transition-colors cursor-pointer"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
