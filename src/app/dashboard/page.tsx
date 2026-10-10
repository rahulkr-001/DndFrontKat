'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Receipt,
  RotateCcw,
  User,
  LogOut,
  Download,
  QrCode,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  Star,
  MessageCircle,
  MessageSquareHeart,
  Lock,
  Mail,
  Phone,
} from 'lucide-react';
import QRCode from 'qrcode';
import { DandiyaLogo } from '@/components/common/DandiyaLogo';
import { apiFetch } from '@/lib/api';

export default function ParticipantDashboard() {
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'ORDERS' | 'REFUNDS'>('TICKETS');
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // QR Code Data URL Map: ticketId -> DataURL
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  // Refund Modal State
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundSubmitting, setRefundSubmitting] = useState(false);
  const [refundMessage, setRefundMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Email + Password Auth State
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Verified Review State
  const [reviewTicket, setReviewTicket] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewQuote, setReviewQuote] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [userReviews, setUserReviews] = useState<Record<string, any>>({});

  const loadData = () => {
    setLoading(true);
    // Check Session
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((s) => {
        if (s.authenticated && s.user) {
          setUser(s.user);
        }
      });

    // Fetch Tickets
    fetch('/api/participant/tickets')
      .then((r) => r.json())
      .then(async (data) => {
        if (data.tickets) {
          setTickets(data.tickets);
          // Generate QR images
          const qrs: Record<string, string> = {};
          for (const t of data.tickets) {
            try {
              const url = await QRCode.toDataURL(t.qrPayload || t.validationToken, {
                width: 240,
                margin: 1,
                color: { dark: '#4A0404', light: '#FFFFFF' },
              });
              qrs[t.id] = url;
            } catch (e) {}
          }
          setQrCodes(qrs);
        }
      });

    // Fetch Orders
    fetch('/api/participant/orders')
      .then((r) => r.json())
      .then((data) => {
        if (data.orders) setOrders(data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch User Reviews (Verified Attendee)
    fetch('/api/participant/testimonial')
      .then((r) => r.json())
      .then((data) => {
        if (data.submittedReviews) {
          const map: Record<string, any> = {};
          for (const rev of data.submittedReviews) {
            if (rev.ticketId) map[rev.ticketId] = rev;
          }
          setUserReviews(map);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'LOGIN') {
        if (!loginEmail || !loginPassword) {
          setAuthLoading(false);
          setAuthError('Please enter both email and password');
          return;
        }
        const res = await apiFetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        const data = await res.json();
        setAuthLoading(false);
        if (!res.ok) {
          setAuthError(data.error || 'Invalid email or password');
        } else {
          setUser(data.user);
          loadData();
        }
      } else {
        if (!loginEmail || !loginPassword) {
          setAuthLoading(false);
          setAuthError('Please enter email and password');
          return;
        }
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: regName.trim() || undefined,
            email: loginEmail,
            password: loginPassword,
            phone: regPhone.trim() || undefined,
          }),
        });
        const data = await res.json();
        setAuthLoading(false);
        if (!res.ok) {
          setAuthError(data.error || 'Registration failed');
        } else {
          setUser(data.user);
          loadData();
        }
      }
    } catch (err: any) {
      setAuthLoading(false);
      setAuthError(err.message || 'Authentication error');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewTicket || !reviewQuote.trim()) return;
    setReviewSubmitting(true);
    setReviewMessage(null);
    try {
      const res = await fetch('/api/participant/testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: reviewTicket.id,
          quote: reviewQuote.trim(),
          rating: reviewRating,
        }),
      });
      const data = await res.json();
      setReviewSubmitting(false);
      if (!res.ok) {
        setReviewMessage({ text: data.error || 'Failed to submit review', success: false });
      } else {
        setReviewMessage({ text: data.message || 'Review submitted successfully!', success: true });
        setUserReviews((prev) => ({
          ...prev,
          [reviewTicket.id]: data.testimonial,
        }));
        setTimeout(() => {
          setReviewTicket(null);
          setReviewQuote('');
          setReviewMessage(null);
        }, 2000);
      }
    } catch (err: any) {
      setReviewSubmitting(false);
      setReviewMessage({ text: err.message, success: false });
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    setUser(null);
    window.location.reload();
  };

  const handleInitiateRefund = async () => {
    if (!refundOrderId || !refundReason.trim()) return;
    setRefundSubmitting(true);
    setRefundMessage(null);

    try {
      const res = await fetch('/api/participant/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: refundOrderId,
          reason: refundReason,
        }),
      });

      const data = await res.json();
      setRefundSubmitting(false);

      if (!res.ok) {
        setRefundMessage({ text: data.error || 'Refund request failed', success: false });
      } else {
        setRefundMessage({ text: data.message || 'Refund successfully processed!', success: true });
        setTimeout(() => {
          setRefundOrderId(null);
          setRefundReason('');
          loadData();
        }, 1500);
      }
    } catch (e: any) {
      setRefundSubmitting(false);
      setRefundMessage({ text: e.message || 'Refund processing error', success: false });
    }
  };

  return (
    <div className="min-h-screen bg-[#090308] text-[#F5EFEB] flex flex-col">
      {/* Top Header */}
      <header className="bg-[#120719] border-b border-[#D4AF37]/30 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <DandiyaLogo className="w-9 h-9" />
            <div>
              <span className="font-serif text-lg font-bold gold-gradient-text uppercase">
                Dandiya Night Katoria
              </span>
              <span className="text-[10px] text-[#F5EFEB]/60 uppercase tracking-widest block -mt-1">
                Participant Passes & Dashboard
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white">{user.name || 'Participant'}</div>
                  <div className="text-[10px] text-[#D4AF37]">{user.phone}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-[#1A0B2E] border border-white/10 text-white/70 hover:text-white hover:bg-[#8C0B21] transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/"
                className="text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                ← Back to Main Festival
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* If Not Logged In, show sleek Dual Auth (OTP / Password) login card */}
        {!user && orders.length === 0 && !loading ? (
          <div className="max-w-md mx-auto my-12 bg-[#120719] border border-[#D4AF37]/40 rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-[#8C0B21]/50 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
              <Ticket className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">
              Access Your Digital Passes
            </h2>
            <p className="text-xs text-[#F5EFEB]/70 mb-6 font-light">
              Sign in with your email & password to retrieve your cryptographic QR passes and payment invoices.
            </p>

            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-[#090308] p-1 border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('LOGIN');
                  setAuthError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                  authMode === 'LOGIN'
                    ? 'bg-[#8C0B21] text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('REGISTER');
                  setAuthError('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                  authMode === 'REGISTER'
                    ? 'bg-[#8C0B21] text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
              {authMode === 'REGISTER' && (
                <>
                  <div>
                    <label className="block text-[11px] text-[#D4AF37] font-semibold uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0D0614] border border-white/20 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#D4AF37] font-semibold uppercase mb-1">
                      Mobile Number (Contact)
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0D0614] border border-white/20 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] text-[#D4AF37] font-semibold uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0614] border border-white/20 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#D4AF37] font-semibold uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D0614] border border-white/20 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.02] disabled:opacity-50 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span>
                  {authMode === 'LOGIN' ? 'Sign In to Dashboard' : 'Create Account & Access Passes'}
                </span>
              </button>
            </form>

            {authError && (
              <p className="text-xs text-red-400 mt-4 flex items-center justify-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{authError}</span>
              </p>
            )}
          </div>
        ) : (
          <div>
            {/* Dashboard Tabs */}
            <div className="flex border-b border-white/10 mb-8 space-x-8 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('TICKETS')}
                className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'TICKETS'
                    ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>My Active Passes ({tickets.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ORDERS')}
                className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'ORDERS'
                    ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Order History ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('REFUNDS')}
                className={`pb-3 flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'REFUNDS'
                    ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refund Tracker</span>
              </button>
            </div>

            {/* TAB 1: TICKETS & QR CODES */}
            {activeTab === 'TICKETS' && (
              <div className="space-y-6">
                {/* Official Emergency WhatsApp Group Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0D2818] via-[#120719] to-[#1A0B2E] border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                        Official Passholder Community
                      </span>
                      <h4 className="font-serif text-sm font-bold text-white">
                        Emergency & Live Event WhatsApp Group
                      </h4>
                      <p className="text-xs text-[#F5EFEB]/70 font-light">
                        Real-time announcements, weather alerts, gate entry updates & festival helpdesk.
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://chat.whatsapp.com/invite/dandiya-night-katoria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shrink-0 shadow-lg shadow-emerald-950/50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Join WhatsApp Group</span>
                  </a>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-16 bg-[#120719] border border-white/10 rounded-2xl p-8">
                    <Ticket className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-white mb-1">
                      No Passes Found
                    </h3>
                    <p className="text-xs text-[#F5EFEB]/60 mb-6">
                      You haven’t booked any passes yet for Dandiya Night 3.0.
                    </p>
                    <Link
                      href="/"
                      className="px-6 py-2.5 rounded-full bg-[#8C0B21] text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Browse Available Passes
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.map((t) => {
                      const isUsed = t.status === 'USED';
                      const isRefunded = t.status === 'REFUNDED';
                      const hasValidScan = t.scans?.some((s: any) => s.result === 'VALID');
                      const isAdmitted = isUsed || hasValidScan;
                      const existingReview = userReviews[t.id];

                      return (
                        <div
                          key={t.id}
                          className="bg-gradient-to-b from-[#1A0B2E] via-[#120719] to-[#090308] border border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between relative group hover:border-[#D4AF37] transition-all"
                        >
                          {/* Ticket Header */}
                          <div className="bg-[#580612] p-4 text-white flex items-center justify-between border-b border-[#D4AF37]/30">
                            <div>
                              <span className="text-[10px] text-[#F7E7A9] font-semibold uppercase tracking-widest block">
                                Dandiya Night 3.0 Official Pass
                              </span>
                              <h4 className="font-serif font-bold text-base">
                                {t.ticketType?.name}
                              </h4>
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                                isUsed
                                  ? 'bg-gray-800 text-gray-300'
                                  : isRefunded
                                  ? 'bg-red-950 text-red-400'
                                  : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              }`}
                            >
                              {t.status}
                            </span>
                          </div>

                          {/* Ticket Body with QR */}
                          <div className="p-5 flex flex-col items-center text-center space-y-4">
                            {/* QR Code Container */}
                            <div className="p-3 bg-white rounded-2xl shadow-lg border border-[#D4AF37]/30">
                              {qrCodes[t.id] ? (
                                <img
                                  src={qrCodes[t.id]}
                                  alt="Ticket QR Code"
                                  className="w-44 h-44 object-contain"
                                />
                              ) : (
                                <div className="w-44 h-44 flex items-center justify-center text-gray-400">
                                  <QrCode className="w-8 h-8" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="text-xs text-[#F5EFEB]/60 uppercase tracking-wider block">
                                Passholder
                              </span>
                              <h5 className="font-serif text-lg font-bold text-white">
                                {t.attendeeName}
                              </h5>
                              <span className="font-mono text-xs text-[#D4AF37]">
                                {t.ticketNumber}
                              </span>
                            </div>

                            {/* Event Metadata */}
                            <div className="w-full pt-3 border-t border-white/10 space-y-2 text-xs text-[#F5EFEB]/70 text-left">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                <span>Monday, 19 October 2026</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                <span>Doors Open 06:00 PM IST</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                                <span className="line-clamp-1">
                                  Indira Garden, Katoria (Bihar)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Admitted Attendee Review Bar */}
                          {isAdmitted && (
                            <div className="px-4 py-2.5 bg-[#120719] border-t border-white/10 flex items-center justify-between text-xs">
                              {existingReview ? (
                                <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Review: {existingReview.moderationStatus}</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setReviewTicket(t);
                                    setReviewRating(5);
                                    setReviewQuote('');
                                    setReviewMessage(null);
                                  }}
                                  className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#8C0B21]/80 to-[#D4AF37]/80 hover:from-[#8C0B21] hover:to-[#D4AF37] text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow"
                                >
                                  <Star className="w-3.5 h-3.5 text-[#F7E7A9] fill-[#F7E7A9]" />
                                  <span>Submit Verified Attendee Review</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Action Footer */}
                          <div className="p-4 bg-[#0D0614] border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] text-[#F5EFEB]/50 font-mono line-clamp-1 max-w-[120px]">
                              SEC: {t.validationToken.slice(0, 8)}...
                            </span>
                            <div className="flex items-center space-x-2">
                              <a
                                href="https://chat.whatsapp.com/invite/dandiya-night-katoria"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900 transition-colors"
                                title="Official WhatsApp Group"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`/api/tickets/pdf/${t.validationToken}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#8C0B21] hover:bg-[#A8102B] text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-md"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === 'ORDERS' && (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-6 rounded-2xl bg-[#120719] border border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-white text-base">
                          {o.orderNumber}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                            o.status === 'PAYMENT_VERIFIED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : o.status === 'REFUNDED'
                              ? 'bg-amber-950 text-amber-300'
                              : 'bg-red-950 text-red-300'
                          }`}
                        >
                          {o.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-[#F5EFEB]/70 space-y-1">
                        <div>
                          Booked on {new Date(o.createdAt).toLocaleDateString()} at{' '}
                          {new Date(o.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="text-white font-medium">
                          {o.orderItems?.map((it: any) => `${it.quantity}x ${it.ticketType?.name}`).join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end justify-between space-y-2">
                      <div className="font-mono text-xl font-bold text-[#F7E7A9]">
                        ₹{o.totalAmount}
                      </div>

                      <div className="flex items-center space-x-3">
                        {o.status === 'PAYMENT_VERIFIED' && (
                          <button
                            onClick={() => {
                              setRefundOrderId(o.id);
                              setRefundReason('');
                              setRefundMessage(null);
                            }}
                            className="text-xs text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Request Refund</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: REFUND POLICY & TRACKER */}
            {activeTab === 'REFUNDS' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#1A0B2E]/60 border border-[#D4AF37]/30 space-y-3 text-xs leading-relaxed">
                  <h4 className="font-serif text-base font-bold text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Official Festival Cancellation & Refund Policy</span>
                  </h4>
                  <ul className="space-y-1.5 text-[#F5EFEB]/80">
                    <li>• <strong>100% Full Refund:</strong> Cancellations submitted more than 7 days prior to event date.</li>
                    <li>• <strong>50% Partial Refund:</strong> Cancellations submitted between 7 days and 48 hours before event gates open.</li>
                    <li>• <strong>No Refund:</strong> Cancellations requested within 48 hours of gates opening.</li>
                    <li>• <strong>Used Passes:</strong> Tickets that have already been scanned by the event coordinator are strictly non-refundable.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                    Recent Refund Activity
                  </h4>
                  {orders.flatMap((o) => o.refunds || []).length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#F5EFEB]/50">
                      No refund requests initiated for your account.
                    </div>
                  ) : (
                    orders
                      .flatMap((o) => (o.refunds || []).map((r: any) => ({ ...r, orderNumber: o.orderNumber })))
                      .map((ref: any) => (
                        <div
                          key={ref.id}
                          className="p-4 rounded-xl bg-[#120719] border border-white/10 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">Refund for #{ref.orderNumber}</div>
                            <div className="text-[11px] text-[#F5EFEB]/60">{ref.reason}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-bold text-[#F7E7A9]">₹{ref.amount}</div>
                            <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                              {ref.status}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Self-Service Refund Modal */}
        {refundOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#120719] border border-[#D4AF37]/50 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
                <span>Confirm Refund Request</span>
              </h3>

              <p className="text-xs text-[#F5EFEB]/70 leading-relaxed font-light">
                Please enter a brief cancellation reason. Eligible funds will be returned automatically through the original payment gateway.
              </p>

              <div>
                <label className="block text-xs text-white mb-1 font-medium">
                  Cancellation Reason:
                </label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Travel plan changed, emergency rescheduling..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-[#0D0614] border border-white/20 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {refundMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    refundMessage.success
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-950 text-red-300 border border-red-500/40'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{refundMessage.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setRefundOrderId(null)}
                  className="px-4 py-2 rounded-xl text-xs text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitiateRefund}
                  disabled={refundSubmitting || !refundReason.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white text-xs font-bold uppercase disabled:opacity-50 flex items-center space-x-2"
                >
                  {refundSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Submit Refund</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verified Attendee Testimonial Modal */}
        {reviewTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#120719] border border-[#D4AF37]/50 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                  <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span>Submit Verified Attendee Review</span>
                </h3>
                <span className="text-[10px] font-mono text-[#D4AF37] bg-[#1A0B2E] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  {reviewTicket.ticketNumber}
                </span>
              </div>

              <p className="text-xs text-[#F5EFEB]/70 leading-relaxed font-light">
                Because your pass was admitted at the gate, your authentic feedback will be showcased on the official festival landing page upon review approval.
              </p>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs text-[#D4AF37] mb-1.5 font-semibold uppercase">
                  Your Overall Experience:
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'text-[#D4AF37] fill-[#D4AF37]'
                            : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-white/60 ml-2 font-mono">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs text-[#D4AF37] mb-1 font-semibold uppercase">
                  Your Feedback Quote:
                </label>
                <textarea
                  value={reviewQuote}
                  onChange={(e) => setReviewQuote(e.target.value)}
                  placeholder="Share your experience regarding sound, crowd vibe, food stalls, or security arrangements..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-[#0D0614] border border-white/20 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {reviewMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    reviewMessage.success
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-950 text-red-300 border border-red-500/40'
                  }`}
                >
                  {reviewMessage.success ? (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{reviewMessage.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewTicket(null)}
                  className="px-4 py-2 rounded-xl text-xs text-white/70 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting || !reviewQuote.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white text-xs font-bold uppercase disabled:opacity-50 flex items-center space-x-2 cursor-pointer shadow"
                >
                  {reviewSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Submit Review</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
