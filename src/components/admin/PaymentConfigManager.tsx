'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Percent,
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
  RefreshCw,
  Calculator,
  ShieldAlert,
  Info,
} from 'lucide-react';

interface PaymentConfigData {
  id?: string;
  gstEnabled: boolean;
  gstPercentage: number;
  gstTaxableBase: 'SUBTOTAL' | 'PLATFORM_FEE' | 'SUBTOTAL_AND_FEE';
  gstDisplayLabel: string;
  platformFeeEnabled: boolean;
  platformFeeType: 'PERCENTAGE' | 'FIXED';
  platformFeeValue: number;
  platformFeePayer: 'CUSTOMER' | 'PLATFORM';
  taxApplicableOnPlatformFee: boolean;
  notes?: string;
  updatedAt?: string;
}

export function PaymentConfigManager({ userRole }: { userRole?: string }) {
  const [config, setConfig] = useState<PaymentConfigData>({
    gstEnabled: true,
    gstPercentage: 18.0,
    gstTaxableBase: 'SUBTOTAL',
    gstDisplayLabel: 'GST & Applicable Taxes (18%)',
    platformFeeEnabled: true,
    platformFeeType: 'PERCENTAGE',
    platformFeeValue: 2.5,
    platformFeePayer: 'CUSTOMER',
    taxApplicableOnPlatformFee: false,
    notes: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Live Preview Simulator Inputs
  const [previewSubtotal, setPreviewSubtotal] = useState<number>(1000);
  const [previewDiscount, setPreviewDiscount] = useState<number>(100);

  const isSuperAdmin = !userRole || userRole === 'SUPER_ADMIN';

  // Load active config on mount
  const fetchConfig = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/payment-config');
      const data = await res.json();
      if (res.ok && data.config) {
        setConfig(data.config);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load payment configuration' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error fetching configuration' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Save handler (Super Admin only)
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Only SUPER_ADMIN has permission to alter tax & platform fee settings.');
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/payment-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      setSaving(false);

      if (res.ok) {
        setConfig(data.config);
        setMessage({ type: 'success', text: 'Financial payment & tax configuration updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update payment configuration' });
      }
    } catch (err: any) {
      setSaving(false);
      setMessage({ type: 'error', text: err.message || 'Error communicating with server' });
    }
  };

  // Authoritative live preview calculation using paise arithmetic
  const subtotalPaise = Math.round(previewSubtotal * 100);
  const discountPaise = Math.round(previewDiscount * 100);
  const netTicketPaise = Math.max(0, subtotalPaise - discountPaise);

  let totalFeePaise = 0;
  let customerFeePaise = 0;
  if (config.platformFeeEnabled) {
    if (config.platformFeeType === 'PERCENTAGE') {
      totalFeePaise = Math.round((netTicketPaise * config.platformFeeValue) / 100);
    } else {
      totalFeePaise = Math.round(config.platformFeeValue * 100);
    }
    if (config.platformFeePayer === 'CUSTOMER') {
      customerFeePaise = totalFeePaise;
    }
  }

  let taxableBasePaise = 0;
  let gstPaise = 0;
  if (config.gstEnabled) {
    if (config.gstTaxableBase === 'PLATFORM_FEE') {
      taxableBasePaise = customerFeePaise;
    } else if (config.gstTaxableBase === 'SUBTOTAL_AND_FEE') {
      taxableBasePaise = netTicketPaise + customerFeePaise;
    } else {
      taxableBasePaise = netTicketPaise;
      if (config.taxApplicableOnPlatformFee && customerFeePaise > 0) {
        taxableBasePaise += customerFeePaise;
      }
    }
    gstPaise = Math.round((taxableBasePaise * config.gstPercentage) / 100);
  }

  const finalTotalPaise = netTicketPaise + customerFeePaise + gstPaise;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-3" />
        <span className="text-xs text-white/60">Loading financial configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-[#D4AF37]" />
            <span>Taxes & Platform Convenience Fee Controls</span>
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Authoritative financial calculation parameters governing public checkout, invoice generation, and gateway settlement.
          </p>
        </div>

        <button
          onClick={fetchConfig}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-xs transition-colors self-start cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Settings</span>
        </button>
      </div>

      {/* Status Message */}
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

      {!isSuperAdmin && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Read-only view. Only the Super Admin role is authorized to alter tax and fee parameters.</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Columns: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: GST & TAXATION */}
          <div className="p-6 rounded-3xl bg-[#120719] border border-[#D4AF37]/30 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#580612] text-[#D4AF37] flex items-center justify-center">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">GST / Tax Configuration</h3>
                  <span className="text-[11px] text-white/60">Configure goods and services tax applied to orders</span>
                </div>
              </div>

              {/* Master Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xs text-white/80 font-semibold">
                  {config.gstEnabled ? 'GST Enabled' : 'GST Disabled'}
                </span>
                <input
                  type="checkbox"
                  disabled={!isSuperAdmin}
                  checked={config.gstEnabled}
                  onChange={(e) => setConfig({ ...config, gstEnabled: e.target.checked })}
                  className="w-5 h-5 rounded accent-[#8C0B21] cursor-pointer"
                />
              </label>
            </div>

            {config.gstEnabled ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                      GST Rate (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        disabled={!isSuperAdmin}
                        value={config.gstPercentage}
                        onChange={(e) =>
                          setConfig({ ...config, gstPercentage: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
                        required
                      />
                      <span className="absolute right-4 top-3 text-white/40 text-sm">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                      Taxable Base
                    </label>
                    <select
                      disabled={!isSuperAdmin}
                      value={config.gstTaxableBase}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          gstTaxableBase: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="SUBTOTAL">Ticket Subtotal Only (Standard)</option>
                      <option value="PLATFORM_FEE">Platform Convenience Fee Only</option>
                      <option value="SUBTOTAL_AND_FEE">Subtotal + Platform Fee Combined</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                    Checkout Display Label
                  </label>
                  <input
                    type="text"
                    disabled={!isSuperAdmin}
                    value={config.gstDisplayLabel}
                    onChange={(e) => setConfig({ ...config, gstDisplayLabel: e.target.value })}
                    placeholder="e.g. GST & Applicable Taxes (18%)"
                    className="w-full px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                  <span className="text-[10px] text-white/50 mt-1 block">
                    This exact line-item text will be rendered in the attendee checkout modal and generated ticket receipt.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 text-xs text-white/60">
                GST is currently turned OFF. Attendees will not be charged any taxes on tickets or fees.
              </div>
            )}
          </div>

          {/* SECTION 2: PLATFORM CONVENIENCE FEE */}
          <div className="p-6 rounded-3xl bg-[#120719] border border-[#D4AF37]/30 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A0B2E] text-[#D4AF37] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Platform Convenience Fee</h3>
                  <span className="text-[11px] text-white/60">Manage operational processing fees per booking</span>
                </div>
              </div>

              {/* Master Toggle */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xs text-white/80 font-semibold">
                  {config.platformFeeEnabled ? 'Fee Enabled' : 'Fee Disabled'}
                </span>
                <input
                  type="checkbox"
                  disabled={!isSuperAdmin}
                  checked={config.platformFeeEnabled}
                  onChange={(e) =>
                    setConfig({ ...config, platformFeeEnabled: e.target.checked })
                  }
                  className="w-5 h-5 rounded accent-[#8C0B21] cursor-pointer"
                />
              </label>
            </div>

            {config.platformFeeEnabled ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                      Fee Calculation Type
                    </label>
                    <select
                      disabled={!isSuperAdmin}
                      value={config.platformFeeType}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          platformFeeType: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="PERCENTAGE">Percentage of Subtotal (%)</option>
                      <option value="FIXED">Fixed Amount per Order (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                      Fee Value ({config.platformFeeType === 'PERCENTAGE' ? '%' : '₹'})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={!isSuperAdmin}
                      value={config.platformFeeValue}
                      onChange={(e) =>
                        setConfig({ ...config, platformFeeValue: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-2">
                      Who Pays the Fee?
                    </label>
                    <select
                      disabled={!isSuperAdmin}
                      value={config.platformFeePayer}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          platformFeePayer: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#090308] border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="CUSTOMER">Charged to Customer (Added to Checkout)</option>
                      <option value="PLATFORM">Absorbed by Organiser (Zero cost to buyer)</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center space-x-2 cursor-pointer p-3 rounded-xl bg-[#090308] border border-white/10 hover:border-white/20">
                      <input
                        type="checkbox"
                        disabled={!isSuperAdmin}
                        checked={config.taxApplicableOnPlatformFee}
                        onChange={(e) =>
                          setConfig({ ...config, taxApplicableOnPlatformFee: e.target.checked })
                        }
                        className="w-4 h-4 rounded accent-[#8C0B21] cursor-pointer"
                      />
                      <span className="text-xs text-white/80">Apply GST to Platform Fee</span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 text-xs text-white/60">
                Platform convenience fee is disabled. Zero extra platform charges will be added.
              </div>
            )}
          </div>

          {/* Notes & Audit Reason */}
          <div className="p-4 rounded-2xl bg-[#120719] border border-white/10 space-y-2">
            <label className="block text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Change Log / Audit Notes
            </label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={config.notes || ''}
              onChange={(e) => setConfig({ ...config, notes: e.target.value })}
              placeholder="e.g. Revised festival GST structure approved by finance committee"
              className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Submit Button */}
          {isSuperAdmin && (
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-[#8C0B21]/40 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording New Configuration...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Deploy Financial Settings</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right Column: Live Interactive Order Calculation Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#120719] border border-[#D4AF37]/40 shadow-2xl space-y-5 sticky top-6">
            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#8C0B21]/60 text-[#D4AF37] flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Live Calculation Preview</h3>
                <span className="text-[11px] text-white/60">Simulate attendee checkout in real-time</span>
              </div>
            </div>

            {/* Test Simulation Controls */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#090308] border border-white/10">
              <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider block">
                Test Parameters
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/70 block mb-1">Ticket Subtotal (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={previewSubtotal}
                    onChange={(e) => setPreviewSubtotal(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#120719] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/70 block mb-1">Coupon Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={previewDiscount}
                    onChange={(e) => setPreviewDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#120719] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Simulated Breakdown */}
            <div className="p-5 rounded-2xl bg-[#090308] border border-[#D4AF37]/30 space-y-3 text-xs">
              <div className="flex justify-between text-white/80">
                <span>Passes Subtotal:</span>
                <span className="font-mono font-semibold text-white">₹{subtotalPaise / 100}</span>
              </div>

              {discountPaise > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount:</span>
                  <span className="font-mono">-₹{discountPaise / 100}</span>
                </div>
              )}

              <div className="flex justify-between text-white/60 border-t border-white/5 pt-2 text-[11px]">
                <span>Net Ticket Base:</span>
                <span className="font-mono">₹{netTicketPaise / 100}</span>
              </div>

              {/* Platform Fee Row */}
              {config.platformFeeEnabled && (
                <div className="flex justify-between text-white/80">
                  <div>
                    <span>Platform Convenience Fee</span>
                    <span className="text-[10px] text-white/50 block">
                      {config.platformFeeType === 'PERCENTAGE'
                        ? `${config.platformFeeValue}%`
                        : `₹${config.platformFeeValue} flat`}
                      {' • '}
                      {config.platformFeePayer === 'CUSTOMER' ? 'Billed to Customer' : 'Absorbed (Free)'}
                    </span>
                  </div>
                  <span className="font-mono font-semibold">
                    {config.platformFeePayer === 'CUSTOMER'
                      ? `₹${customerFeePaise / 100}`
                      : '₹0.00'}
                  </span>
                </div>
              )}

              {/* GST Row */}
              {config.gstEnabled && (
                <div className="flex justify-between text-white/80">
                  <div>
                    <span>{config.gstDisplayLabel}</span>
                    <span className="text-[10px] text-white/50 block">
                      {config.gstPercentage}% on {config.gstTaxableBase} (₹{taxableBasePaise / 100})
                    </span>
                  </div>
                  <span className="font-mono font-semibold">₹{gstPaise / 100}</span>
                </div>
              )}

              {/* Final Amount Payable */}
              <div className="pt-3 border-t border-[#D4AF37]/30 flex justify-between items-baseline text-sm font-extrabold text-white">
                <div>
                  <span className="block">Final Payable Amount:</span>
                  <span className="text-[10px] text-[#D4AF37] font-normal block">
                    Zero floating-point drift (integer paise precision)
                  </span>
                </div>
                <span className="font-mono text-xl text-[#F7E7A9]">
                  ₹{finalTotalPaise / 100}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/70 space-y-1">
              <div className="flex items-center space-x-1.5 text-[#D4AF37] font-semibold">
                <Info className="w-3.5 h-3.5" />
                <span>Production Security Guarantee</span>
              </div>
              <p className="leading-relaxed font-light">
                All computations are performed authoritatively on the server. The client cannot forge or alter the final payable amount or tax base.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
