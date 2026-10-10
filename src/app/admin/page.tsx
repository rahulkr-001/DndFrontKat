'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Receipt,
  RotateCcw,
  Tag,
  CreditCard,
  QrCode,
  Image as ImageIcon,
  Palette,
  Users,
  Shield,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Loader2,
  TrendingUp,
  Upload,
  Trash2,
  Edit3,
  Eye,
  LogOut,
  Save,
  Clock,
  MapPin,
  Sparkles,
  Camera,
} from 'lucide-react';
import { DandiyaLogo } from '@/components/common/DandiyaLogo';
import { CmsManager } from '@/components/admin/CmsManager';
import { PaymentConfigManager } from '@/components/admin/PaymentConfigManager';
import { VenuePhotosManager } from '@/components/admin/VenuePhotosManager';
import { apiFetch } from '@/lib/api';

export default function AdminDashboardPage() {
  const [activeModule, setActiveModule] = useState<
    | 'OVERVIEW'
    | 'EVENTS'
    | 'TIERS'
    | 'BOOKINGS'
    | 'TICKETS'
    | 'COUPONS'
    | 'REFUNDS'
    | 'GALLERY'
    | 'TEMPLATES'
    | 'STAFF'
    | 'AUDIT'
    | 'CMS'
    | 'PAYMENTS'
    | 'VENUE_PHOTOS'
  >('OVERVIEW');

  // Authenticated User State
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Login Modal State for Unauthenticated Admins
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Main Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [tierStats, setTierStats] = useState<any[]>([]);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Form & Action Modals
  // 1. Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('10');
  const [newCouponType, setNewCouponType] = useState('PERCENTAGE');
  const [newCouponMin, setNewCouponMin] = useState('99');
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  // 2. Staff Form
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('VALIDATOR');
  const [creatingStaff, setCreatingStaff] = useState(false);


  // 3. New Tier Form
  const [newTierName, setNewTierName] = useState('');
  const [newTierCategory, setNewTierCategory] = useState('REGULAR');
  const [newTierPrice, setNewTierPrice] = useState('99');
  const [newTierCapacity, setNewTierCapacity] = useState('500');
  const [newTierMaxPerOrder, setNewTierMaxPerOrder] = useState('10');
  const [creatingTier, setCreatingTier] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);

  // 4. Edit Tier State
  const [editingTier, setEditingTier] = useState<any>(null);

  // 5. Manual Refund Form
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('Customer requested cancellation');
  const [processingRefund, setProcessingRefund] = useState(false);

  // 6. Gallery Upload State
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // 7. Template Editor State (Canva-like Visual Layout)
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [templateName, setTemplateName] = useState('Festive Pass Default');
  const [templatePrimaryColor, setTemplatePrimaryColor] = useState('#6B0F1A');
  const [templateAccentColor, setTemplateAccentColor] = useState('#D4AF37');
  const [templateTextColor, setTemplateTextColor] = useState('#FFFFFF');
  const [templateQrPos, setTemplateQrPos] = useState('RIGHT');
  const [templateBadgeText, setTemplateBadgeText] = useState('OFFICIAL ENTRY PASS');
  const [templateTagline, setTemplateTagline] = useState('नाचेगा KATORIA एक साथ • Presented by Starlight Club');
  const [templateTerms, setTemplateTerms] = useState('');
  const [templateFooterNotes, setTemplateFooterNotes] = useState('');
  const [templateShowWhatsApp, setTemplateShowWhatsApp] = useState(true);
  const [savingTemplate, setSavingTemplate] = useState(false);

  // 8. Event Editor State
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [savingEvent, setSavingEvent] = useState(false);

  // Verify Session on Load
  const checkAuth = async () => {
    try {
      const res = await apiFetch('/api/auth/session');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setAdminUser(data.user);
        // Switch to the user's permissible default landing module
        if (data.user.role === 'FINANCE_ADMIN') {
          setActiveModule('REFUNDS');
        } else if (data.user.role === 'VALIDATOR') {
          setActiveModule('TICKETS');
        } else if (data.user.role === 'CONTENT_ADMIN') {
          setActiveModule('CMS');
        }
      } else {

        setAdminUser(null);
      }
    } catch (e) {
      setAdminUser(null);
    } finally {
      setAuthChecking(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch Dashboard Metrics
  const fetchDashboardMetrics = () => {
    setLoading(true);
    apiFetch('/api/admin/metrics')
      .then((r) => r.json())
      .then((data) => {
        if (data.metrics) {
          setMetrics(data.metrics);
          setTierStats(data.tierStats || []);
          setRecentScans(data.recentScans || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (adminUser) {
      fetchDashboardMetrics();
    }
  }, [adminUser]);

  // Fetch Module-Specific Data on Tab Switch
  useEffect(() => {
    if (!adminUser) return;

    if (activeModule === 'EVENTS') {
      fetch('/api/admin/events').then((r) => r.json()).then((d) => setEvents(d.events || []));
    }
    if (activeModule === 'TIERS') {
      fetch('/api/admin/ticket-types').then((r) => r.json()).then((d) => setTicketTypes(d.ticketTypes || []));
    }
    if (activeModule === 'BOOKINGS') {
      fetch('/api/admin/bookings').then((r) => r.json()).then((d) => setBookings(d.orders || []));
    }
    if (activeModule === 'TICKETS') {
      fetch('/api/admin/tickets').then((r) => r.json()).then((d) => setTickets(d.tickets || []));
    }
    if (activeModule === 'COUPONS') {
      fetch('/api/admin/coupons').then((r) => r.json()).then((d) => setCoupons(d.coupons || []));
    }
    if (activeModule === 'REFUNDS') {
      fetch('/api/admin/refunds').then((r) => r.json()).then((d) => setRefunds(d.refunds || []));
    }
    if (activeModule === 'GALLERY') {
      fetch('/api/admin/gallery').then((r) => r.json()).then((d) => setGalleries(d.galleries || []));
    }
    if (activeModule === 'TEMPLATES') {
      fetch('/api/admin/ticket-templates').then((r) => r.json()).then((d) => {
        const tmpls = d.templates || [];
        setTemplates(tmpls);
        if (tmpls.length > 0 && !editingTemplate) {
          const tmpl = tmpls[0];
          const cfg = (tmpl.layoutConfig as any) || {};
          setEditingTemplate(tmpl);
          setTemplateName(tmpl.name || 'Festive Pass Default');
          setTemplatePrimaryColor(cfg.primaryColor || tmpl.primaryColor || '#6B0F1A');
          setTemplateAccentColor(cfg.accentColor || tmpl.accentColor || '#D4AF37');
          setTemplateTextColor(cfg.textColor || tmpl.textColor || '#FFFFFF');
          setTemplateQrPos(cfg.qrPosition || tmpl.qrPosition || 'RIGHT');
          setTemplateBadgeText(cfg.badgeText || 'OFFICIAL ENTRY PASS');
          setTemplateTagline(cfg.tagline || 'नाचेगा KATORIA एक साथ • Presented by Starlight Club');
          setTemplateTerms(cfg.termsText || tmpl.termsText || '');
          setTemplateFooterNotes(cfg.footerNotes || tmpl.footerNotes || '');
          setTemplateShowWhatsApp(cfg.showWhatsApp !== false);
        }
      });
    }
    if (activeModule === 'STAFF') {
      fetch('/api/admin/staff').then((r) => r.json()).then((d) => setStaffUsers(d.staffUsers || []));
    }
    if (activeModule === 'AUDIT') {
      fetch('/api/admin/audit-logs').then((r) => r.json()).then((d) => setAuditLogs(d.auditLogs || []));
    }
  }, [activeModule, adminUser]);

  // Admin Login Flow (Password & OTP)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      setLoggingIn(false);
      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials');
      } else {
        setAdminUser(data.user);
        fetchDashboardMetrics();
      }
    } catch (e: any) {
      setLoggingIn(false);
      setLoginError(e.message || 'Network error during login');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    setAdminUser(null);
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCoupon(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          discountType: newCouponType,
          discountValue: Number(newCouponDiscount),
          minOrderAmount: Number(newCouponMin),
        }),
      });
      const data = await res.json();
      setCreatingCoupon(false);
      if (data.success) {
        setCoupons([data.coupon, ...coupons]);
        setNewCouponCode('');
      } else {
        alert(data.error || 'Failed to create coupon');
      }
    } catch (e) {
      setCreatingCoupon(false);
    }
  };

  // Create Staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingStaff(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: newStaffPhone,
          email: newStaffEmail,
          name: newStaffName,
          role: newStaffRole,
        }),
      });
      const data = await res.json();
      setCreatingStaff(false);
      if (data.success) {
        setStaffUsers([data.user, ...staffUsers]);
        setNewStaffPhone('');
        setNewStaffEmail('');
        setNewStaffName('');
        if (data.otpWorkflow?.sent) {
          alert(`Staff member created! Invitation & OTP sent to ${newStaffEmail} via Resend.`);
        } else {
          alert('Staff member created successfully!');
        }
      } else {
        alert(data.error || 'Failed to assign staff role');
      }
    } catch (e: any) {
      setCreatingStaff(false);
      alert(e.message);
    }
  };


  // Create Ticket Tier
  const handleCreateTier = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTier(true);
    try {
      const res = await fetch('/api/admin/ticket-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTierName,
          category: newTierCategory,
          price: Number(newTierPrice),
          totalCapacity: Number(newTierCapacity),
          maxPerOrder: Number(newTierMaxPerOrder),
        }),
      });
      const data = await res.json();
      setCreatingTier(false);
      if (data.success) {
        setTicketTypes([...ticketTypes, data.ticketType]);
        setShowTierModal(false);
        setNewTierName('');
      } else {
        alert(data.error || 'Failed to create tier');
      }
    } catch (e) {
      setCreatingTier(false);
    }
  };

  // Update Ticket Tier
  const handleUpdateTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;
    try {
      const res = await fetch('/api/admin/ticket-types', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTier),
      });
      const data = await res.json();
      if (data.success) {
        setTicketTypes(ticketTypes.map((t) => (t.id === data.ticketType.id ? data.ticketType : t)));
        setEditingTier(null);
      } else {
        alert(data.error || 'Failed to update ticket tier');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Execute Manual Refund
  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrderId) return;
    setProcessingRefund(true);
    try {
      const res = await fetch('/api/admin/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: refundOrderId,
          amount: refundAmount ? Number(refundAmount) : undefined,
          reason: refundReason,
        }),
      });
      const data = await res.json();
      setProcessingRefund(false);
      if (data.success) {
        alert('Refund initiated and processed successfully!');
        setRefundOrderId('');
        setRefundAmount('');
        // Refresh refunds list
        fetch('/api/admin/refunds').then((r) => r.json()).then((d) => setRefunds(d.refunds || []));
      } else {
        alert(data.error || 'Failed to process refund');
      }
    } catch (e: any) {
      setProcessingRefund(false);
      alert(e.message);
    }
  };

  // Gallery Upload
  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImageUrl) return;
    setUploadingImage(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: galleryImageUrl,
          caption: galleryCaption,
          galleryId: galleries[0]?.id,
        }),
      });
      const data = await res.json();
      setUploadingImage(false);
      if (data.success) {
        setGalleryImageUrl('');
        setGalleryCaption('');
        fetch('/api/admin/gallery').then((r) => r.json()).then((d) => setGalleries(d.galleries || []));
      } else {
        alert(data.error || 'Failed to add image');
      }
    } catch (e: any) {
      setUploadingImage(false);
      alert(e.message);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetch('/api/admin/gallery').then((r) => r.json()).then((d) => setGalleries(d.galleries || []));
      }
    } catch (e) {}
  };

  // Save Ticket Template
  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    setSavingTemplate(true);
    try {
      const layoutConfig = {
        primaryColor: templatePrimaryColor,
        accentColor: templateAccentColor,
        textColor: templateTextColor,
        qrPosition: templateQrPos,
        badgeText: templateBadgeText,
        tagline: templateTagline,
        termsText: templateTerms,
        footerNotes: templateFooterNotes,
        showWhatsApp: templateShowWhatsApp,
      };

      const res = await fetch('/api/admin/ticket-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTemplate.id,
          name: templateName,
          primaryColor: templatePrimaryColor,
          accentColor: templateAccentColor,
          textColor: templateTextColor,
          qrPosition: templateQrPos,
          termsText: templateTerms,
          footerNotes: templateFooterNotes,
          layoutConfig,
          createVersion: true,
        }),
      });
      const data = await res.json();
      setSavingTemplate(false);
      if (data.success) {
        alert('Ticket template updated and new version published successfully!');
        setEditingTemplate(data.template);
      } else {
        alert(data.error || 'Failed to save template');
      }
    } catch (e: any) {
      setSavingTemplate(false);
      alert(e.message);
    }
  };

  // Save Event Details
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setSavingEvent(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent),
      });
      const data = await res.json();
      setSavingEvent(false);
      if (data.success) {
        alert('Event details updated successfully!');
        setEvents(events.map((ev) => (ev.id === data.event.id ? data.event : ev)));
        setEditingEvent(null);
      } else {
        alert(data.error || 'Failed to save event');
      }
    } catch (e: any) {
      setSavingEvent(false);
      alert(e.message);
    }
  };

  // Unauthenticated Login Modal View
  if (!authChecking && !adminUser) {
    return (
      <div className="min-h-screen bg-[#070208] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#120719] border border-[#D4AF37]/40 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto flex items-center justify-center">
              <DandiyaLogo className="w-14 h-14" />
            </div>
            <h1 className="font-serif text-2xl font-bold gold-gradient-text uppercase">
              Admin Command Center
            </h1>
            <p className="text-xs text-white/60">
              Dandiya Night 3.0 • Starlight Club
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                Super Admin Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="rahulydv1130@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Log In Securely</span>}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <Link href="/" className="text-xs text-[#D4AF37] hover:underline">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070208] text-white flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-[#120719] border-b border-[#D4AF37]/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <DandiyaLogo className="w-9 h-9" />
            <div>
              <span className="font-serif text-lg font-bold gold-gradient-text uppercase">
                Dandiya Night Katoria
              </span>
              <span className="text-[10px] text-white/60 uppercase tracking-widest block -mt-1">
                Enterprise Command Center
              </span>
            </div>
          </Link>
          <span className="px-2.5 py-0.5 rounded-full bg-[#580612] text-[#F7E7A9] text-xs font-bold border border-[#D4AF37]/40 uppercase">
            {adminUser?.role || 'SUPER_ADMIN'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/admin/scanner"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-lg"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Gate Scanner</span>
          </Link>

          <Link href="/" className="text-xs text-white/70 hover:text-white hidden sm:inline">
            Public Site ↗
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0D0614] border-r border-white/5 p-4 space-y-1 overflow-y-auto">
          <div className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider px-3 py-2">
            Operations & Ticketing
          </div>

          {[
            { id: 'OVERVIEW', label: 'Executive Overview', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'FINANCE_ADMIN'] },
            { id: 'EVENTS', label: 'Events Manager', icon: Calendar, roles: ['SUPER_ADMIN', 'EVENT_ADMIN'] },
            { id: 'TIERS', label: 'Ticket Tiers & Quotas', icon: Ticket, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'FINANCE_ADMIN'] },
            { id: 'BOOKINGS', label: 'Bookings & Orders', icon: Receipt, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'FINANCE_ADMIN'] },
            { id: 'TICKETS', label: 'Issued Tickets', icon: Ticket, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'VALIDATOR'] },
            { id: 'COUPONS', label: 'Promotions & Coupons', icon: Tag, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'FINANCE_ADMIN'] },
            { id: 'REFUNDS', label: 'Refunds & Reconciliation', icon: RotateCcw, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'FINANCE_ADMIN'] },
            { id: 'GALLERY', label: 'Gallery CMS', icon: ImageIcon, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'CONTENT_ADMIN'] },
            { id: 'VENUE_PHOTOS', label: 'Venue Photos CMS', icon: Camera, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'CONTENT_ADMIN'] },
            { id: 'PAYMENTS', label: 'Taxes & Payment Fee', icon: CreditCard, roles: ['SUPER_ADMIN', 'FINANCE_ADMIN'] },
            { id: 'TEMPLATES', label: 'Ticket Templates', icon: Palette, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'CONTENT_ADMIN'] },
            { id: 'STAFF', label: 'Staff & RBAC', icon: Users, roles: ['SUPER_ADMIN'] },
            { id: 'AUDIT', label: 'Forensic Audit Logs', icon: FileText, roles: ['SUPER_ADMIN', 'FINANCE_ADMIN'] },
            { id: 'CMS', label: 'Festival CMS', icon: Sparkles, roles: ['SUPER_ADMIN', 'EVENT_ADMIN', 'CONTENT_ADMIN'] },
          ]
            .filter((item) => {
              if (!adminUser) return true;
              if (adminUser.role === 'SUPER_ADMIN') return true;
              return item.roles.includes(adminUser.role);
            })
            .map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1A0B2E] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>


        {/* Content Body Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#070208]">
          {/* MODULE: OVERVIEW */}
          {activeModule === 'OVERVIEW' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white mb-1">
                  Executive Performance Dashboard
                </h2>
                <p className="text-xs text-white/60">
                  Real-time ticket reservations, gateway sales, and gate check-in analytics.
                </p>
              </div>

              {/* 4 Primary KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-[#120719] border border-[#D4AF37]/30 shadow-xl">
                  <span className="text-xs text-white/60 uppercase tracking-wider block mb-1">
                    Gross Ticket Revenue
                  </span>
                  <div className="font-mono text-3xl font-black text-white gold-gradient-text">
                    ₹{metrics?.totalRevenue ? metrics.totalRevenue.toLocaleString() : '0'}
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-2">
                    Verified through Razorpay gateway
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#120719] border border-[#D4AF37]/30 shadow-xl">
                  <span className="text-xs text-white/60 uppercase tracking-wider block mb-1">
                    Tickets Sold
                  </span>
                  <div className="font-mono text-3xl font-black text-white">
                    {metrics?.totalSold || 0}{' '}
                    <span className="text-xs text-white/40 font-normal">
                      / {metrics?.totalCapacity || 0}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-[#D4AF37] h-full"
                      style={{
                        width: `${
                          metrics?.totalCapacity
                            ? Math.min(100, Math.round((metrics.totalSold / metrics.totalCapacity) * 100))
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#120719] border border-[#D4AF37]/30 shadow-xl">
                  <span className="text-xs text-white/60 uppercase tracking-wider block mb-1">
                    Gate Admission Scans
                  </span>
                  <div className="font-mono text-3xl font-black text-[#F7E7A9]">
                    {metrics?.ticketsUsed || 0}
                  </div>
                  <span className="text-[10px] text-white/60 block mt-2">
                    {metrics?.attendancePercentage || 0}% Check-in rate across gates
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#120719] border border-[#D4AF37]/30 shadow-xl">
                  <span className="text-xs text-white/60 uppercase tracking-wider block mb-1">
                    Processed Refunds
                  </span>
                  <div className="font-mono text-3xl font-black text-white">
                    ₹{metrics?.totalRefundAmount || 0}
                  </div>
                  <span className="text-[10px] text-amber-400 block mt-2">
                    {metrics?.totalRefundCount || 0} cancellations reconciled
                  </span>
                </div>
              </div>

              {/* Tier Sales Distribution Breakdown */}
              <div className="bg-[#120719] border border-white/10 rounded-2xl p-6">
                <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                  <span>Ticket Tier Quotas & Velocity</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 uppercase">
                        <th className="py-3 px-4">Tier Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Sold</th>
                        <th className="py-3 px-4">Reserved</th>
                        <th className="py-3 px-4">Total Quota</th>
                        <th className="py-3 px-4">Fill Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tierStats.map((tier) => (
                        <tr key={tier.ticketTypeId} className="hover:bg-white/5">
                          <td className="py-3.5 px-4 font-bold text-white">{tier.name}</td>
                          <td className="py-3.5 px-4 text-[#D4AF37] uppercase">{tier.category}</td>
                          <td className="py-3.5 px-4 font-mono font-bold">₹{tier.price}</td>
                          <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{tier.soldCount}</td>
                          <td className="py-3.5 px-4 font-mono text-amber-300">{tier.reservedCount}</td>
                          <td className="py-3.5 px-4 font-mono text-white/70">{tier.totalCapacity}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-[#1A0B2E] text-[#D4AF37] font-mono font-bold">
                              {tier.percentSold}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Real-time Gate Scans Stream */}
              <div className="bg-[#120719] border border-white/10 rounded-2xl p-6">
                <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <QrCode className="w-5 h-5 text-[#D4AF37]" />
                  <span>Live Gate Admission Stream</span>
                </h3>

                <div className="space-y-3">
                  {recentScans.length === 0 ? (
                    <div className="text-white/40 text-xs py-4 text-center">
                      No scan records available.
                    </div>
                  ) : (
                    recentScans.map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-xl bg-[#090308] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">
                            {s.ticket?.attendeeName} •{' '}
                            <span className="text-[#D4AF37]">{s.ticket?.ticketType?.name}</span>
                          </div>
                          <div className="text-[10px] text-white/50">
                            Scanned at {new Date(s.scannedAt).toLocaleTimeString()} by{' '}
                            {s.scannedByUser?.name || 'Gatekeeper'} ({s.gateName || 'Main Gate'})
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            s.result === 'VALID'
                              ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-red-950 text-red-400'
                          }`}
                        >
                          {s.result}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MODULE: EVENTS MANAGER */}
          {activeModule === 'EVENTS' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Events Manager ({events.length})
                  </h2>
                  <p className="text-xs text-white/60">
                    Configure festival branding, schedule, venue specifications, terms & refund policies.
                  </p>
                </div>
              </div>

              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-[#120719] border border-[#D4AF37]/30 rounded-3xl p-6 shadow-xl space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-serif text-2xl font-bold text-white gold-gradient-text">
                          {ev.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            ev.status === 'PUBLISHED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 italic">{ev.tagline}</p>
                    </div>

                    <button
                      onClick={() => setEditingEvent(ev)}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 w-fit cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Event Details</span>
                    </button>
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div className="p-4 rounded-2xl bg-[#090308] border border-white/5 space-y-2">
                      <span className="font-semibold text-[#D4AF37] uppercase tracking-wider block">
                        Venue & Gates
                      </span>
                      <p className="font-bold text-white text-sm">{ev.venue?.name}</p>
                      <p className="text-white/60">{ev.venue?.address}, {ev.venue?.city}, {ev.venue?.state}</p>
                      <p className="text-[#F7E7A9]">Capacity: {ev.venue?.capacity} persons</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090308] border border-white/5 space-y-2">
                      <span className="font-semibold text-[#D4AF37] uppercase tracking-wider block">
                        Date & Timing
                      </span>
                      <p className="font-bold text-white text-sm">
                        {new Date(ev.startDate).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-white/60">Doors Open: {ev.doorsOpenTime || '6:00 PM IST'}</p>
                      <p className="text-[#F7E7A9]">Presented by: {ev.organizer?.name}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#090308] border border-white/5 space-y-2">
                      <span className="font-semibold text-[#D4AF37] uppercase tracking-wider block">
                        Ticketing Overview
                      </span>
                      <p className="font-bold text-white text-sm">
                        {ev.ticketTypes?.length || 0} Ticket Tiers Active
                      </p>
                      <p className="text-white/60">
                        Single: ₹99 • Couple: ₹149
                      </p>
                      <p className="text-emerald-400 font-mono">
                        Slug: /{ev.slug}
                      </p>
                    </div>
                  </div>

                  {/* Terms & Policies */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-4 rounded-2xl bg-[#090308] border border-white/5">
                      <span className="font-bold text-white block mb-2">Terms & Conditions</span>
                      <p className="text-white/60 whitespace-pre-line leading-relaxed">{ev.termsAndConditions}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#090308] border border-white/5">
                      <span className="font-bold text-white block mb-2">Cancellation & Refund Policy</span>
                      <p className="text-white/60 whitespace-pre-line leading-relaxed">{ev.refundPolicy}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Edit Event Modal */}
              {editingEvent && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                  <div className="max-w-2xl w-full bg-[#120719] border border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl space-y-4 my-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="font-serif text-xl font-bold text-white">Edit Event Details</h3>
                      <button onClick={() => setEditingEvent(null)} className="text-white/60 hover:text-white">✕</button>
                    </div>

                    <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-white/70 mb-1">Event Title</label>
                        <input
                          type="text"
                          value={editingEvent.title || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 mb-1">Tagline</label>
                          <input
                            type="text"
                            value={editingEvent.tagline || ''}
                            onChange={(e) => setEditingEvent({ ...editingEvent, tagline: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">Doors Open Time</label>
                          <input
                            type="text"
                            value={editingEvent.doorsOpenTime || ''}
                            onChange={(e) => setEditingEvent({ ...editingEvent, doorsOpenTime: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingEvent.description || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 mb-1">Hero Image URL</label>
                          <input
                            type="text"
                            value={editingEvent.heroImageUrl || ''}
                            onChange={(e) => setEditingEvent({ ...editingEvent, heroImageUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">Status</label>
                          <select
                            value={editingEvent.status || 'PUBLISHED'}
                            onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          >
                            <option value="PUBLISHED">PUBLISHED (Live)</option>
                            <option value="DRAFT">DRAFT</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Terms and Conditions</label>
                        <textarea
                          rows={3}
                          value={editingEvent.termsAndConditions || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, termsAndConditions: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-white/70 mb-1">Refund Policy</label>
                        <textarea
                          rows={2}
                          value={editingEvent.refundPolicy || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, refundPolicy: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                        />
                      </div>

                      {/* Official WhatsApp Emergency Community Settings */}
                      <div className="p-4 rounded-xl bg-[#090308] border border-emerald-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            Official WhatsApp Group Settings
                          </label>
                          <label className="flex items-center space-x-2 text-xs text-white/80 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingEvent.whatsappEnabled ?? true}
                              onChange={(e) =>
                                setEditingEvent({ ...editingEvent, whatsappEnabled: e.target.checked })
                              }
                              className="rounded accent-emerald-500"
                            />
                            <span>Enable Group Display</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-white/60 text-[11px] mb-1">WhatsApp Group Invite Link</label>
                          <input
                            type="url"
                            value={editingEvent.whatsappGroupUrl || ''}
                            onChange={(e) =>
                              setEditingEvent({ ...editingEvent, whatsappGroupUrl: e.target.value })
                            }
                            placeholder="https://chat.whatsapp.com/invite/..."
                            className="w-full px-3 py-2 rounded-xl bg-[#120719] border border-white/20 text-white font-mono text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-white/60 text-[11px] mb-1">Group Title Badge</label>
                            <input
                              type="text"
                              value={editingEvent.whatsappGroupTitle || ''}
                              onChange={(e) =>
                                setEditingEvent({ ...editingEvent, whatsappGroupTitle: e.target.value })
                              }
                              placeholder="Dandiya Night 3.0 Official Pass Holders"
                              className="w-full px-3 py-2 rounded-xl bg-[#120719] border border-white/20 text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 text-[11px] mb-1">Group Subtitle Description</label>
                            <input
                              type="text"
                              value={editingEvent.whatsappGroupDesc || ''}
                              onChange={(e) =>
                                setEditingEvent({ ...editingEvent, whatsappGroupDesc: e.target.value })
                              }
                              placeholder="Emergency updates, weather alerts & gate assistance"
                              className="w-full px-3 py-2 rounded-xl bg-[#120719] border border-white/20 text-white text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setEditingEvent(null)}
                          className="px-4 py-2 rounded-xl bg-white/10 text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingEvent}
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold"
                        >
                          {savingEvent ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE: TICKET TIERS & QUOTAS */}
          {activeModule === 'TIERS' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Ticket Tiers & Quota Management ({ticketTypes.length})
                  </h2>
                  <p className="text-xs text-white/60">
                    Real-time inventory quotas, dynamic pricing, and concurrent sale control.
                  </p>
                </div>

                <button
                  onClick={() => setShowTierModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Tier</span>
                </button>
              </div>

              {/* Tiers Table */}
              <div className="bg-[#120719] border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 uppercase bg-white/5">
                        <th className="py-3 px-4">Tier Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Total Quota</th>
                        <th className="py-3 px-4">Sold</th>
                        <th className="py-3 px-4">Reserved</th>
                        <th className="py-3 px-4">Remaining</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {ticketTypes.map((tier) => {
                        const inv = tier.inventory;
                        const total = inv?.totalCapacity || 0;
                        const sold = inv?.soldCount || 0;
                        const reserved = inv?.reservedCount || 0;
                        const remaining = Math.max(0, total - sold - reserved);

                        return (
                          <tr key={tier.id} className="hover:bg-white/5">
                            <td className="py-3.5 px-4 font-bold text-white">{tier.name}</td>
                            <td className="py-3.5 px-4 text-[#D4AF37] uppercase">{tier.category}</td>
                            <td className="py-3.5 px-4 font-mono font-bold text-[#F7E7A9]">₹{tier.price}</td>
                            <td className="py-3.5 px-4 font-mono">{total}</td>
                            <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{sold}</td>
                            <td className="py-3.5 px-4 font-mono text-amber-300">{reserved}</td>
                            <td className="py-3.5 px-4 font-mono text-white/80">{remaining}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                  tier.status === 'ACTIVE'
                                    ? 'bg-emerald-950 text-emerald-400'
                                    : 'bg-red-950 text-red-400'
                                }`}
                              >
                                {tier.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => setEditingTier({ ...tier, totalCapacity: total })}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#D4AF37] text-xs font-semibold flex items-center space-x-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit Tier Modal */}
              {editingTier && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="max-w-md w-full bg-[#120719] border border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-serif text-lg font-bold text-white">Edit Tier: {editingTier.name}</h3>
                      <button onClick={() => setEditingTier(null)} className="text-white/60 hover:text-white">✕</button>
                    </div>

                    <form onSubmit={handleUpdateTier} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-white/70 mb-1">Tier Name</label>
                        <input
                          type="text"
                          value={editingTier.name}
                          onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/70 mb-1">Price (₹)</label>
                          <input
                            type="number"
                            value={editingTier.price}
                            onChange={(e) => setEditingTier({ ...editingTier, price: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">Total Capacity</label>
                          <input
                            type="number"
                            value={editingTier.totalCapacity}
                            onChange={(e) => setEditingTier({ ...editingTier, totalCapacity: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/70 mb-1">Max Per Order</label>
                          <input
                            type="number"
                            value={editingTier.maxPerOrder}
                            onChange={(e) => setEditingTier({ ...editingTier, maxPerOrder: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">Sale Status</label>
                          <select
                            value={editingTier.status}
                            onChange={(e) => setEditingTier({ ...editingTier, status: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="PAUSED">PAUSED</option>
                            <option value="SOLD_OUT">SOLD_OUT</option>
                            <option value="HIDDEN">HIDDEN</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingTier(null)}
                          className="px-4 py-2 rounded-xl bg-white/10 text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Create Tier Modal */}
              {showTierModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="max-w-md w-full bg-[#120719] border border-[#D4AF37]/50 rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-serif text-lg font-bold text-white">Create Ticket Tier</h3>
                      <button onClick={() => setShowTierModal(false)} className="text-white/60 hover:text-white">✕</button>
                    </div>

                    <form onSubmit={handleCreateTier} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-white/70 mb-1">Tier Name</label>
                        <input
                          type="text"
                          value={newTierName}
                          onChange={(e) => setNewTierName(e.target.value)}
                          placeholder="e.g. VIP Star Access"
                          className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/70 mb-1">Category</label>
                          <select
                            value={newTierCategory}
                            onChange={(e) => setNewTierCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                          >
                            <option value="REGULAR">REGULAR</option>
                            <option value="COUPLE">COUPLE</option>
                            <option value="VIP">VIP</option>
                            <option value="GROUP">GROUP</option>
                            <option value="EARLY_BIRD">EARLY_BIRD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">Price (₹)</label>
                          <input
                            type="number"
                            value={newTierPrice}
                            onChange={(e) => setNewTierPrice(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/70 mb-1">Total Capacity</label>
                          <input
                            type="number"
                            value={newTierCapacity}
                            onChange={(e) => setNewTierCapacity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 mb-1">Max Per Order</label>
                          <input
                            type="number"
                            value={newTierMaxPerOrder}
                            onChange={(e) => setNewTierMaxPerOrder(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowTierModal(false)}
                          className="px-4 py-2 rounded-xl bg-white/10 text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={creatingTier}
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold"
                        >
                          {creatingTier ? 'Creating...' : 'Create Tier'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE: REFUNDS & RECONCILIATION */}
          {activeModule === 'REFUNDS' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Refunds & Reconciliation ({refunds.length})
                  </h2>
                  <p className="text-xs text-white/60">
                    Payment gateway cancellation processing, partial refunds, and financial audit logs.
                  </p>
                </div>
              </div>

              {/* Manual Refund Action Card */}
              <form
                onSubmit={handleProcessRefund}
                className="bg-[#120719] border border-[#D4AF37]/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Order ID</label>
                  <input
                    type="text"
                    value={refundOrderId}
                    onChange={(e) => setRefundOrderId(e.target.value)}
                    placeholder="UUID or Order Number"
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Amount in ₹ (Leave blank for full)</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="Full Refund"
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Audit Reason</label>
                  <input
                    type="text"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={processingRefund}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{processingRefund ? 'Processing...' : 'Issue Refund'}</span>
                </button>
              </form>

              {/* Refunds Table */}
              <div className="bg-[#120719] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase bg-white/5">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Gateway</th>
                      <th className="py-3 px-4">Gateway Refund ID</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {refunds.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-white/40">
                          No refund records found.
                        </td>
                      </tr>
                    ) : (
                      refunds.map((r) => (
                        <tr key={r.id} className="hover:bg-white/5">
                          <td className="py-3.5 px-4 font-mono text-white/60">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {r.order?.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{r.order?.customerName}</div>
                            <div className="text-[10px] text-white/50">{r.order?.customerPhone}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#F7E7A9]">₹{r.amount}</td>
                          <td className="py-3.5 px-4 uppercase text-white/70">{r.payment?.gateway}</td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-white/50">
                            {r.gatewayRefundId || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                r.status === 'PROCESSED'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : 'bg-amber-950 text-amber-400'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-white/70 max-w-xs truncate">{r.reason}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: GALLERY CMS */}
          {activeModule === 'GALLERY' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Gallery CMS & Retrospective Imagery
                </h2>
                <p className="text-xs text-white/60">
                  Curate festive highlights, previous event memories, and high-resolution festival photography.
                </p>
              </div>

              {/* Add Image Form */}
              <form
                onSubmit={handleAddGalleryImage}
                className="bg-[#120719] border border-[#D4AF37]/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-white/70">Image URL</label>
                    <label className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer flex items-center space-x-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload to Cloudinary</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('file', file);
                          fd.append('folder', 'dandiya_gallery');
                          try {
                            setUploadingImage(true);
                            const res = await fetch('/api/admin/gallery/upload', { method: 'POST', body: fd });
                            const d = await res.json();
                            setUploadingImage(false);
                            if (d.success) {
                              setGalleryImageUrl(d.url);
                            } else {
                              alert(d.error || 'Upload failed');
                            }
                          } catch (err: any) {
                            setUploadingImage(false);
                            alert(err.message);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={galleryImageUrl}
                    onChange={(e) => setGalleryImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or Cloudinary URL"
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Caption</label>
                  <input
                    type="text"
                    value={galleryCaption}
                    onChange={(e) => setGalleryCaption(e.target.value)}
                    placeholder="e.g. Royal Garba Circle at Indira Garden"
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImage ? 'Adding...' : 'Add Image'}</span>
                </button>
              </form>

              {/* Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleries[0]?.images?.map((img: any) => (
                  <div
                    key={img.id}
                    className="bg-[#120719] border border-white/10 rounded-2xl overflow-hidden group shadow-lg flex flex-col"
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={img.imageUrl}
                        alt={img.altText || img.caption || 'Event image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 flex items-center justify-between flex-1">
                      <span className="text-xs text-white font-medium truncate flex-1 pr-2">
                        {img.caption || 'Festive Glimpse'}
                      </span>
                      <button
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        className="p-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE: TICKET TEMPLATES (CANVA-LIKE VISUAL DESIGNER) */}
          {activeModule === 'TEMPLATES' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
                    <Palette className="w-6 h-6 text-[#D4AF37]" />
                    <span>Canva-Style Ticket Template Studio</span>
                  </h2>
                  <p className="text-xs text-white/60">
                    Live visual layout engine. Customize branding colors, QR position, attendee typography, and download the exact A4 PDF.
                  </p>
                </div>

                {editingTemplate && (
                  <a
                    href={`/api/admin/ticket-templates?preview=true&templateId=${editingTemplate.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Sample A4 PDF</span>
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Visual Live Ticket Preview (Canvas) */}
                <div className="space-y-3 sticky top-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      Interactive Live Pass Preview
                    </span>
                    <span className="text-[10px] text-white/50 font-mono">
                      Exact representation of generated passes
                    </span>
                  </div>

                  {/* The Digital Festive Ticket Card */}
                  <div
                    className="rounded-3xl p-6 shadow-2xl border-2 relative overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor: templatePrimaryColor,
                      borderColor: templateAccentColor,
                      color: templateTextColor,
                    }}
                  >
                    {/* Background Pattern Accent */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-between space-y-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <DandiyaLogo className="w-10 h-10" />
                          <div>
                            <span
                              className="font-serif text-xl font-bold uppercase tracking-wider block"
                              style={{ color: templateTextColor }}
                            >
                              Dandiya Night 3.0
                            </span>
                            <span
                              className="text-[10px] uppercase tracking-widest font-semibold block"
                              style={{ color: templateAccentColor }}
                            >
                              {templateTagline}
                            </span>
                          </div>
                        </div>

                        <span
                          className="px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase"
                          style={{ backgroundColor: templateAccentColor, color: '#000' }}
                        >
                          {templateBadgeText}
                        </span>
                      </div>

                      {/* Middle Pass Info */}
                      <div
                        className="grid grid-cols-2 gap-3 text-xs py-3 border-y"
                        style={{ borderColor: `${templateAccentColor}40` }}
                      >
                        <div>
                          <span className="opacity-70 block text-[10px] uppercase">Attendee</span>
                          <span className="font-bold text-sm">Rahul Sharma</span>
                        </div>
                        <div>
                          <span className="opacity-70 block text-[10px] uppercase">Ticket Ref</span>
                          <span className="font-mono text-sm">DND-2026-001</span>
                        </div>
                        <div>
                          <span className="opacity-70 block text-[10px] uppercase">Date & Timing</span>
                          <span className="font-bold">19 Oct 2026 • 6 PM</span>
                        </div>
                        <div>
                          <span className="opacity-70 block text-[10px] uppercase">Venue & Gate</span>
                          <span className="font-bold">Indira Garden, Katoria</span>
                        </div>
                      </div>

                      {/* QR and Verification Section */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-[10px] opacity-80 flex-1 leading-relaxed">
                          Cryptographically signed pass. Present this QR at the turnstile gate for laser scanning.
                        </div>

                        <div
                          className="w-20 h-20 bg-white p-2 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                          style={{ order: templateQrPos === 'LEFT' ? -1 : 1 }}
                        >
                          <QrCode className="w-16 h-16 text-black" />
                        </div>
                      </div>

                      {/* WhatsApp Community Box Preview */}
                      {templateShowWhatsApp && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[10px] flex items-center justify-between text-emerald-200">
                          <span className="font-semibold">Official Emergency WhatsApp Group Linked</span>
                          <span className="underline font-bold">Join Community →</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Canva-Like Configuration Editor */}
                <form
                  onSubmit={handleSaveTemplate}
                  className="bg-[#120719] border border-white/10 rounded-3xl p-6 space-y-4 text-xs shadow-xl"
                >
                  <h3 className="font-serif text-base font-bold text-white flex items-center justify-between">
                    <span>Design Properties & Palette</span>
                    {editingTemplate?.versions?.length > 0 && (
                      <span className="text-[10px] font-mono text-[#D4AF37] px-2 py-0.5 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30">
                        Active Version: v{editingTemplate.versions[0].version}
                      </span>
                    )}
                  </h3>

                  <div>
                    <label className="block text-white/70 mb-1">Template Preset Name</label>
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="e.g. Royal Maroon Festive Pass"
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/70 mb-1">Primary Color (BG)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={templatePrimaryColor}
                          onChange={(e) => setTemplatePrimaryColor(e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={templatePrimaryColor}
                          onChange={(e) => setTemplatePrimaryColor(e.target.value)}
                          className="w-20 px-2 py-1.5 rounded-lg bg-[#090308] border border-white/20 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1">Accent Gold (Trim)</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={templateAccentColor}
                          onChange={(e) => setTemplateAccentColor(e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={templateAccentColor}
                          onChange={(e) => setTemplateAccentColor(e.target.value)}
                          className="w-20 px-2 py-1.5 rounded-lg bg-[#090308] border border-white/20 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/70 mb-1">Text Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={templateTextColor}
                          onChange={(e) => setTemplateTextColor(e.target.value)}
                          className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          value={templateTextColor}
                          onChange={(e) => setTemplateTextColor(e.target.value)}
                          className="w-20 px-2 py-1.5 rounded-lg bg-[#090308] border border-white/20 text-white font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 mb-1">Header Badge Label</label>
                      <input
                        type="text"
                        value={templateBadgeText}
                        onChange={(e) => setTemplateBadgeText(e.target.value)}
                        placeholder="OFFICIAL ENTRY PASS"
                        className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 mb-1">QR Code Position</label>
                      <select
                        value={templateQrPos}
                        onChange={(e) => setTemplateQrPos(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white"
                      >
                        <option value="RIGHT">Right Aligned (Default)</option>
                        <option value="LEFT">Left Aligned</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Subtitle / Tagline Text</label>
                    <input
                      type="text"
                      value={templateTagline}
                      onChange={(e) => setTemplateTagline(e.target.value)}
                      placeholder="नाचेगा KATORIA एक साथ • Presented by Starlight Club"
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-white/80 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={templateShowWhatsApp}
                        onChange={(e) => setTemplateShowWhatsApp(e.target.checked)}
                        className="rounded accent-[#D4AF37]"
                      />
                      <span>Print Official Emergency WhatsApp Link on Generated Passes</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Printed Pass Terms & Instructions</label>
                    <textarea
                      rows={3}
                      value={templateTerms}
                      onChange={(e) => setTemplateTerms(e.target.value)}
                      placeholder="1. Strict Traditional Dress Code: Kediyu / Chaniya Choli / Kurta Pajama required.&#10;2. Present this digital pass at gate turnstiles."
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Footer Notes</label>
                    <input
                      type="text"
                      value={templateFooterNotes}
                      onChange={(e) => setTemplateFooterNotes(e.target.value)}
                      placeholder="This is a computer-generated cryptographically signed e-pass."
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {editingTemplate && (
                      <a
                        href={`/api/admin/ticket-templates?preview=true&templateId=${editingTemplate.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all text-center"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Preview PDF</span>
                      </a>
                    )}
                    <button
                      type="submit"
                      disabled={savingTemplate}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{savingTemplate ? 'Publishing Version...' : 'Save & Publish Version'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODULE: BOOKINGS */}
          {activeModule === 'BOOKINGS' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Bookings & Transactions ({bookings.length})
                  </h2>
                  <p className="text-xs text-white/60">
                    All customer orders with idempotency verification and gateway records.
                  </p>
                </div>
              </div>

              <div className="bg-[#120719] border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 uppercase bg-white/5">
                        <th className="py-3 px-4">Order Ref</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Passes Booked</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Gateway</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-white/5">
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {b.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{b.customerName}</div>
                            <div className="text-[11px] text-white/60">{b.customerPhone}</div>
                          </td>
                          <td className="py-3.5 px-4 text-white/80">
                            {b.orderItems?.map((it: any) => `${it.quantity}x ${it.ticketType?.name}`).join(', ')}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#F7E7A9]">
                            ₹{b.totalAmount}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-white/70 uppercase">
                            {b.payments?.[0]?.gateway || 'SANDBOX'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                b.status === 'PAYMENT_VERIFIED'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : b.status === 'REFUNDED'
                                  ? 'bg-amber-950 text-amber-400'
                                  : 'bg-red-950 text-red-400'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: TICKETS */}
          {activeModule === 'TICKETS' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Issued Digital Passes ({tickets.length})
                </h2>
                <p className="text-xs text-white/60">
                  Individual tickets with cryptographic validation tokens and check-in states.
                </p>
              </div>

              <div className="bg-[#120719] border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 uppercase bg-white/5">
                        <th className="py-3 px-4">Ticket Number</th>
                        <th className="py-3 px-4">Passholder</th>
                        <th className="py-3 px-4">Tier</th>
                        <th className="py-3 px-4">Order Ref</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Validation Token</th>
                        <th className="py-3 px-4">PDF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tickets.map((t) => (
                        <tr key={t.id} className="hover:bg-white/5">
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {t.ticketNumber}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {t.attendeeName}
                          </td>
                          <td className="py-3.5 px-4 text-[#D4AF37]">
                            {t.ticketType?.name}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-white/60">
                            {t.order?.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                                t.status === 'ISSUED'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : t.status === 'USED'
                                  ? 'bg-gray-800 text-gray-300'
                                  : 'bg-red-950 text-red-400'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-white/50 max-w-[150px] truncate">
                            {t.validationToken}
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`/api/tickets/pdf/${t.validationToken}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#D4AF37] hover:underline flex items-center space-x-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: COUPONS */}
          {activeModule === 'COUPONS' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white">
                    Promotional Coupons & Discounts
                  </h2>
                  <p className="text-xs text-white/60">
                    Configure promo codes, percentage or flat discounts, and minimum order values.
                  </p>
                </div>
              </div>

              {/* Create Coupon Form */}
              <form
                onSubmit={handleCreateCoupon}
                className="bg-[#120719] border border-[#D4AF37]/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
              >
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. KATORIA25"
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={creatingCoupon}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Code</span>
                </button>
              </form>

              {/* Coupon Table */}
              <div className="bg-[#120719] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase bg-white/5">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Min Spend</th>
                      <th className="py-3 px-4">Used Count</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5">
                        <td className="py-3 px-4 font-mono font-bold text-[#F7E7A9]">{c.code}</td>
                        <td className="py-3 px-4 font-bold text-white">
                          {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                        </td>
                        <td className="py-3 px-4 text-white/70">₹{c.minOrderAmount || 0}</td>
                        <td className="py-3 px-4 font-mono text-white/80">{c.usedCount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              c.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                            }`}
                          >
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: STAFF & RBAC */}
          {activeModule === 'STAFF' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Administrative Staff & RBAC
                </h2>
                <p className="text-xs text-white/60">
                  Assign least-privilege administrative roles: Super Admin, Event Admin, Finance Admin, Validator.
                </p>
              </div>

              {/* Add Staff Member */}
              <form
                onSubmit={handleCreateStaff}
                className="bg-[#120719] border border-[#D4AF37]/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Staff Full Name</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="e.g. Vikram Joshi"
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Email (Resend OTP Invite)</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="e.g. vikram@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    placeholder="e.g. 9876500005"
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Assigned Role</label>

                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/20 text-white text-xs"
                  >
                    <option value="VALIDATOR">Validator (QR Scanning Only)</option>
                    <option value="FINANCE_ADMIN">Finance Admin (Refunds & Reconcile)</option>
                    <option value="EVENT_ADMIN">Event Admin (Tiers & Content)</option>
                    <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={creatingStaff}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Staff Role</span>
                </button>
              </form>

              {/* Staff List */}
              <div className="bg-[#120719] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase bg-white/5">
                      <th className="py-3 px-4">Staff Member</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">RBAC Role</th>
                      <th className="py-3 px-4">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {staffUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                        <td className="py-3 px-4 font-mono text-white/80">{u.phone}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-[10px] uppercase">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white/60">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: FORENSIC AUDIT LOGS */}
          {activeModule === 'AUDIT' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">
                  Forensic Audit Trail Logs ({auditLogs.length})
                </h2>
                <p className="text-xs text-white/60">
                  Immutable record of ticket admissions, financial operations, and administrative actions.
                </p>
              </div>

              <div className="bg-[#120719] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase bg-white/5">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Resource</th>
                      <th className="py-3 px-4">Initiator</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5">
                        <td className="py-3 px-4 font-mono text-white/60">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#F7E7A9]">
                          {log.action}
                        </td>
                        <td className="py-3 px-4 text-white">
                          {log.resourceType}
                        </td>
                        <td className="py-3 px-4 text-white/70">
                          {log.user?.name || log.userId || 'SYSTEM'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-white/60 max-w-xs truncate">
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: FESTIVAL EXPERIENCE CMS */}
          {activeModule === 'CMS' && <CmsManager />}

          {/* MODULE: TAXES & PLATFORM FEE CONTROLS */}
          {activeModule === 'PAYMENTS' && <PaymentConfigManager userRole={adminUser?.role} />}

          {/* MODULE: VENUE PHOTOS MANAGEMENT */}
          {activeModule === 'VENUE_PHOTOS' && <VenuePhotosManager />}
        </main>
      </div>
    </div>
  );
}
