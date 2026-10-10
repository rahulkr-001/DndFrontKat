'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Plus,
  Trash2,
  Loader2,
  Clock,
  MessageSquareHeart,
  Users,
  Award,
  Film,
  Star,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Upload,
  Camera,
} from 'lucide-react';
import { VenuePhotosManager } from './VenuePhotosManager';

export function CmsManager() {
  const [activeTab, setActiveTab] = useState<
    'STORY' | 'HIGHLIGHTS' | 'SCHEDULE' | 'TESTIMONIALS' | 'TEAM' | 'SPONSORS' | 'VIDEOS' | 'VENUE'
  >('STORY');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [cmsData, setCmsData] = useState<any>({
    story: null,
    highlights: [],
    schedules: [],
    testimonials: [],
    teamMembers: [],
    sponsors: [],
    videos: [],
    eventId: null,
  });

  // Story Form State
  const [storyForm, setStoryForm] = useState({
    badge: 'THE CULTURAL PHENOMENON',
    heading: "Katoria's Biggest Festive Celebration Returns",
    story:
      'Dandiya Night 3.0 brings together the spirit of Navratri, the rhythmic pulse of traditional Raas, and high-energy Bollywood music at the scenic Indira Garden in Katoria. Presented by Starlight Club and organized by Ankit Keshri & Team, this festival unites friends, families, and youth for an unforgettable evening under the starlit sky.',
    highlightOne: 'Authentic Live Dhol & Bollywood Dandiya Beats',
    highlightTwo: 'Grand Raas Circle under the Stars',
    imageOneUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    imageTwoUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  });

  // New Item Form States
  const [newHighlight, setNewHighlight] = useState({
    title: '',
    description: '',
    iconName: 'Sparkles',
    badge: 'Live',
  });

  const [newSchedule, setNewSchedule] = useState({
    time: '06:00 PM',
    title: '',
    description: '',
  });

  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    role: 'Katoria Attendee',
    quote: '',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  });

  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: 'Volunteer Coordinator',
    bio: '',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  });

  const [newSponsor, setNewSponsor] = useState({
    name: '',
    tier: 'COMMUNITY_PARTNER',
    description: '',
    logoUrl: '/logo.svg',
    websiteUrl: '',
    instagram: '',
    facebook: '',
    youtube: '',
    twitter: '',
    linkedin: '',
  });

  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  });

  const fetchCmsData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cms');
      const data = await res.json();
      if (data.cms) {
        setCmsData(data.cms);
        if (data.cms.story) {
          setStoryForm({
            badge: data.cms.story.badge || '',
            heading: data.cms.story.heading || '',
            story: data.cms.story.story || '',
            highlightOne: data.cms.story.highlightOne || '',
            highlightTwo: data.cms.story.highlightTwo || '',
            imageOneUrl: data.cms.story.imageOneUrl || '',
            imageTwoUrl: data.cms.story.imageTwoUrl || '',
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to load CMS data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // 1. Save Story
  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'story',
          data: { ...storyForm, eventId: cmsData.eventId },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Festival story updated successfully!');
        fetchCmsData();
      } else {
        showToast('error', data.error || 'Failed to update story');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  // 2. Add Item Helper
  const handleAddItem = async (section: string, itemData: any, resetFn: () => void) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          data: { ...itemData, eventId: cmsData.eventId },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `${section} added successfully!`);
        resetFn();
        fetchCmsData();
      } else {
        showToast('error', data.error || `Failed to add ${section}`);
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  // 3. Delete Item Helper
  const handleDeleteItem = async (section: string, id: string) => {
    if (!confirm(`Are you sure you want to remove this ${section}?`)) return;
    try {
      const res = await fetch(`/api/admin/cms?section=${section}&id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `${section} removed successfully!`);
        fetchCmsData();
      } else {
        showToast('error', data.error || `Failed to delete ${section}`);
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // 4. Testimonial Moderation Helper
  const handleModerateTestimonial = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'testimonial',
          id,
          data: {
            moderationStatus: status,
            isPublished: status === 'APPROVED',
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Review marked as ${status}!`);
        fetchCmsData();
      } else {
        showToast('error', data.error || 'Failed to update review status');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            <span>Festival Content & Experience CMS</span>
          </h2>
          <p className="text-xs text-white/60">
            Real-time dynamic control of public landing page sections (Story, Highlights, Timeline, Testimonials, Team, Sponsors, Videos).
          </p>
        </div>
        <button
          onClick={fetchCmsData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white text-xs flex items-center space-x-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Refresh Data</span>}
        </button>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border-red-500/50 text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Subtab Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'STORY', label: 'Story & Theme', icon: BookOpen },
          { id: 'HIGHLIGHTS', label: 'Highlights', icon: Sparkles },
          { id: 'SCHEDULE', label: 'Timeline Schedule', icon: Clock },
          { id: 'TESTIMONIALS', label: 'Testimonials', icon: MessageSquareHeart },
          { id: 'TEAM', label: 'Team & Organisers', icon: Users },
          { id: 'SPONSORS', label: 'Partners & Sponsors', icon: Award },
          { id: 'VIDEOS', label: 'Videos & Teaser', icon: Film },
          { id: 'VENUE', label: 'Venue Photos', icon: Camera },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                active
                  ? 'bg-[#8C0B21] text-white border border-[#D4AF37]/50 shadow-md shadow-[#8C0B21]/40'
                  : 'bg-[#120719] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: STORY & THEME */}
      {activeTab === 'STORY' && (
        <div className="bg-[#120719] border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="font-serif text-lg font-bold text-white mb-4">
            Edit Festival Story & About Section
          </h3>
          <form onSubmit={handleSaveStory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Section Super Badge
                </label>
                <input
                  type="text"
                  value={storyForm.badge}
                  onChange={(e) => setStoryForm({ ...storyForm, badge: e.target.value })}
                  placeholder="THE CULTURAL PHENOMENON"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={storyForm.heading}
                  onChange={(e) => setStoryForm({ ...storyForm, heading: e.target.value })}
                  placeholder="Katoria's Biggest Festive Celebration Returns"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                Story Narrative Body
              </label>
              <textarea
                rows={4}
                value={storyForm.story}
                onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                placeholder="Full festival story description..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Highlight Pillar 1
                </label>
                <input
                  type="text"
                  value={storyForm.highlightOne}
                  onChange={(e) => setStoryForm({ ...storyForm, highlightOne: e.target.value })}
                  placeholder="Authentic Live Dhol & Bollywood Dandiya Beats"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Highlight Pillar 2
                </label>
                <input
                  type="text"
                  value={storyForm.highlightTwo}
                  onChange={(e) => setStoryForm({ ...storyForm, highlightTwo: e.target.value })}
                  placeholder="Grand Raas Circle under the Stars"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#D4AF37] uppercase">
                    Primary Photo URL
                  </label>
                  <label className="text-[11px] text-[#F7E7A9] hover:underline cursor-pointer flex items-center space-x-1">
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
                        fd.append('folder', 'dandiya_cms_story');
                        try {
                          showToast('success', 'Uploading to Cloudinary...');
                          const res = await fetch('/api/admin/gallery/upload', { method: 'POST', body: fd });
                          const d = await res.json();
                          if (d.success) {
                            setStoryForm((prev) => ({ ...prev, imageOneUrl: d.url }));
                            showToast('success', 'Image uploaded to Cloudinary successfully!');
                          } else {
                            showToast('error', d.error || 'Upload failed');
                          }
                        } catch (err: any) {
                          showToast('error', err.message);
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={storyForm.imageOneUrl}
                  onChange={(e) => setStoryForm({ ...storyForm, imageOneUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#D4AF37] uppercase">
                    Secondary Overlay Photo URL
                  </label>
                  <label className="text-[11px] text-[#F7E7A9] hover:underline cursor-pointer flex items-center space-x-1">
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
                        fd.append('folder', 'dandiya_cms_story');
                        try {
                          showToast('success', 'Uploading to Cloudinary...');
                          const res = await fetch('/api/admin/gallery/upload', { method: 'POST', body: fd });
                          const d = await res.json();
                          if (d.success) {
                            setStoryForm((prev) => ({ ...prev, imageTwoUrl: d.url }));
                            showToast('success', 'Image uploaded to Cloudinary successfully!');
                          } else {
                            showToast('error', d.error || 'Upload failed');
                          }
                        } catch (err: any) {
                          showToast('error', err.message);
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={storyForm.imageTwoUrl}
                  onChange={(e) => setStoryForm({ ...storyForm, imageTwoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>


            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Festival Story</span>
            </button>
          </form>
        </div>
      )}

      {/* SUBTAB 2: HIGHLIGHTS */}
      {activeTab === 'HIGHLIGHTS' && (
        <div className="space-y-6">
          {/* Add New Highlight Form */}
          <div className="bg-[#120719] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Add New Festival Highlight
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem('highlight', newHighlight, () =>
                  setNewHighlight({ title: '', description: '', iconName: 'Sparkles', badge: 'Live' })
                );
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newHighlight.title}
                  onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
                  placeholder="Live DJ & Dhol"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newHighlight.description}
                  onChange={(e) => setNewHighlight({ ...newHighlight, description: e.target.value })}
                  placeholder="Curated beats & folk rhythms..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={newHighlight.badge}
                  onChange={(e) => setNewHighlight({ ...newHighlight, badge: e.target.value })}
                  placeholder="At Venue / Live Beats"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase flex items-center justify-center space-x-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Highlight</span>
              </button>
            </form>
          </div>

          {/* Highlights List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cmsData.highlights?.map((h: any) => (
              <div
                key={h.id}
                className="p-5 rounded-2xl bg-[#120719] border border-white/10 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] text-[#D4AF37] bg-[#1A0B2E] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 uppercase font-bold">
                      {h.badge || 'Feature'}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-white mb-1">{h.title}</h4>
                  <p className="text-xs text-white/60">{h.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteItem('highlight', h.id)}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: SCHEDULE */}
      {activeTab === 'SCHEDULE' && (
        <div className="space-y-6">
          <div className="bg-[#120719] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Add Timeline Schedule Step
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem('schedule', newSchedule, () =>
                  setNewSchedule({ time: '06:00 PM', title: '', description: '' })
                );
              }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  placeholder="06:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                  placeholder="Aarti & Diya Ceremony"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                  placeholder="Traditional lamp lighting..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase flex items-center justify-center space-x-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Step</span>
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {cmsData.schedules?.map((s: any) => (
              <div
                key={s.id}
                className="p-4 rounded-xl bg-[#120719] border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-mono text-xs font-bold text-[#D4AF37] px-3 py-1 bg-[#1A0B2E] rounded-lg border border-[#D4AF37]/30">
                    {s.time}
                  </span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">{s.title}</h4>
                    <p className="text-xs text-white/60">{s.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem('schedule', s.id)}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: TESTIMONIALS */}
      {activeTab === 'TESTIMONIALS' && (
        <div className="space-y-6">
          <div className="bg-[#120719] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Add Attendee Testimonial
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem('testimonial', newTestimonial, () =>
                  setNewTestimonial({
                    name: '',
                    role: 'Katoria Attendee',
                    quote: '',
                    rating: 5,
                    avatarUrl:
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                  })
                );
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Attendee Name
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    placeholder="Vikash Keshri"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Role / Subtitle
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                    placeholder="Couple Pass Attendee"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={newTestimonial.avatarUrl}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, avatarUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Testimonial Quote
                </label>
                <textarea
                  rows={2}
                  value={newTestimonial.quote}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                  placeholder="Best celebration of the year! Non-stop music and safe family vibe."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase flex items-center space-x-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cmsData.testimonials?.map((t: any) => {
              const status = t.moderationStatus || (t.isPublished ? 'APPROVED' : 'PENDING');
              const isApproved = status === 'APPROVED';
              const isPending = status === 'PENDING';
              const isRejected = status === 'REJECTED';

              return (
                <div
                  key={t.id}
                  className={`p-5 rounded-2xl bg-[#120719] border transition-all flex flex-col justify-between ${
                    isPending
                      ? 'border-amber-500/50 shadow-lg shadow-amber-950/20'
                      : isApproved
                      ? 'border-white/10 hover:border-[#D4AF37]/50'
                      : 'border-red-500/30 opacity-75'
                  }`}
                >
                  <div>
                    {/* Header: Rating & Moderation Status */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                        ))}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {t.isVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                            ✓ Verified {t.ticket?.ticketNumber ? `#${t.ticket.ticketNumber.slice(-4)}` : 'Pass'}
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            isApproved
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : isPending
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/50 animate-pulse'
                              : 'bg-red-950 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-white/80 italic mb-4">"{t.quote}"</p>
                  </div>

                  <div>
                    {/* Attendee Details */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-3 mb-3">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={t.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                          alt={t.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-serif text-xs font-bold text-white">{t.name}</h4>
                          <span className="text-[10px] text-[#D4AF37]">{t.role}</span>
                          {t.user?.phone && (
                            <span className="text-[9px] text-white/40 block font-mono">{t.user.phone}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteItem('testimonial', t.id)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                      {!isApproved && (
                        <button
                          onClick={() => handleModerateTestimonial(t.id, 'APPROVED')}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-bold uppercase tracking-wider transition-colors"
                        >
                          Approve & Publish
                        </button>
                      )}
                      {!isRejected && (
                        <button
                          onClick={() => handleModerateTestimonial(t.id, 'REJECTED')}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-red-900/40 hover:bg-red-800 text-red-200 text-[10px] font-bold uppercase tracking-wider transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 5: TEAM & ORGANISERS */}
      {activeTab === 'TEAM' && (
        <div className="space-y-6">
          <div className="bg-[#120719] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Add Organising Team Member
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem('teamMember', newTeamMember, () =>
                  setNewTeamMember({
                    name: '',
                    role: 'Volunteer Coordinator',
                    bio: '',
                    imageUrl:
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                  })
                );
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    placeholder="Ankit Keshri"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={newTeamMember.role}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                    placeholder="Event Director"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={newTeamMember.imageUrl}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                  Bio
                </label>
                <input
                  type="text"
                  value={newTeamMember.bio}
                  onChange={(e) => setNewTeamMember({ ...newTeamMember, bio: e.target.value })}
                  placeholder="Leading cultural production and crowd safety..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase flex items-center space-x-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsData.teamMembers?.map((m: any) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-[#120719] border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={m.imageUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'}
                    alt={m.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/40"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">{m.name}</h4>
                    <span className="text-[11px] text-[#D4AF37] block">{m.role}</span>
                    <p className="text-[11px] text-white/60">{m.bio}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem('teamMember', m.id)}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: SPONSORS */}
      {activeTab === 'SPONSORS' && (
        <div className="space-y-6">
          <div className="bg-[#120719] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Add Partner / Sponsor with Social Handles
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem(
                  'sponsor',
                  {
                    name: newSponsor.name,
                    tier: newSponsor.tier,
                    description: newSponsor.description,
                    logoUrl: newSponsor.logoUrl,
                    websiteUrl: newSponsor.websiteUrl || '#',
                    socialLinks: {
                      instagram: newSponsor.instagram || undefined,
                      facebook: newSponsor.facebook || undefined,
                      youtube: newSponsor.youtube || undefined,
                      twitter: newSponsor.twitter || undefined,
                      linkedin: newSponsor.linkedin || undefined,
                      website: newSponsor.websiteUrl || undefined,
                    },
                  },
                  () =>
                    setNewSponsor({
                      name: '',
                      tier: 'COMMUNITY_PARTNER',
                      description: '',
                      logoUrl: '/logo.svg',
                      websiteUrl: '',
                      instagram: '',
                      facebook: '',
                      youtube: '',
                      twitter: '',
                      linkedin: '',
                    })
                );
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Partner Name *
                  </label>
                  <input
                    type="text"
                    value={newSponsor.name}
                    onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                    placeholder="Starlight Club"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Tier Label *
                  </label>
                  <input
                    type="text"
                    value={newSponsor.tier}
                    onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                    placeholder="PRESENTED BY / COMMUNITY PARTNER"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={newSponsor.logoUrl}
                    onChange={(e) => setNewSponsor({ ...newSponsor, logoUrl: e.target.value })}
                    placeholder="/logo.svg or https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Partner Description / Subtitle
                  </label>
                  <input
                    type="text"
                    value={newSponsor.description}
                    onChange={(e) => setNewSponsor({ ...newSponsor, description: e.target.value })}
                    placeholder="Leading cultural organization in Katoria..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="url"
                    value={newSponsor.websiteUrl}
                    onChange={(e) => setNewSponsor({ ...newSponsor, websiteUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Social Media Handles */}
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-2">
                  Social Profiles (Visible as clickable icons on public page)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Instagram URL</span>
                    <input
                      type="url"
                      value={newSponsor.instagram}
                      onChange={(e) => setNewSponsor({ ...newSponsor, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Facebook URL</span>
                    <input
                      type="url"
                      value={newSponsor.facebook}
                      onChange={(e) => setNewSponsor({ ...newSponsor, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">YouTube URL</span>
                    <input
                      type="url"
                      value={newSponsor.youtube}
                      onChange={(e) => setNewSponsor({ ...newSponsor, youtube: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Twitter / X URL</span>
                    <input
                      type="url"
                      value={newSponsor.twitter}
                      onChange={(e) => setNewSponsor({ ...newSponsor, twitter: e.target.value })}
                      placeholder="https://x.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">LinkedIn URL</span>
                    <input
                      type="url"
                      value={newSponsor.linkedin}
                      onChange={(e) => setNewSponsor({ ...newSponsor, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase flex items-center space-x-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Partner / Sponsor</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cmsData.sponsors?.map((sp: any) => {
              const soc = sp.socialLinks || {};
              const socialCount = Object.values(soc).filter(Boolean).length;

              return (
                <div
                  key={sp.id}
                  className="p-5 rounded-2xl bg-[#120719] border border-white/10 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-[#D4AF37] uppercase font-bold block mb-1">
                        {sp.tier}
                      </span>
                      <h4 className="font-serif text-base font-bold text-white">{sp.name}</h4>
                      {sp.description && (
                        <p className="text-xs text-white/60 line-clamp-2 mt-1 font-light">
                          {sp.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteItem('sponsor', sp.id)}
                      className="p-2 text-white/40 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
                    <span>
                      {sp.websiteUrl && sp.websiteUrl !== '#' ? '🌐 Website linked' : 'No direct web URL'}
                    </span>
                    <span className="text-[#D4AF37]">
                      {socialCount > 0 ? `${socialCount} social handles` : 'No socials'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 7: VIDEOS */}
      {activeTab === 'VIDEOS' && (
        <div className="space-y-6">
          <div className="bg-[#120719] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-white mb-4">
              Add Promo Video / Reel
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem('video', newVideo, () =>
                  setNewVideo({
                    title: '',
                    description: '',
                    videoUrl: '',
                    thumbnailUrl: '',
                  })
                );
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="Official Dandiya Night 3.0 Promo"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Video Embed URL / YouTube Link
                  </label>
                  <input
                    type="url"
                    value={newVideo.videoUrl}
                    onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Thumbnail Poster URL
                  </label>
                  <input
                    type="url"
                    value={newVideo.thumbnailUrl}
                    onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="Festive highlights and DJ promo reel..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090308] border border-white/10 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] text-white font-bold text-xs uppercase flex items-center space-x-2 cursor-pointer hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Video</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cmsData.videos?.map((v: any) => (
              <div
                key={v.id}
                className="p-5 rounded-2xl bg-[#120719] border border-white/10 flex items-start justify-between"
              >
                <div>
                  <h4 className="font-serif text-base font-bold text-white mb-1">{v.title}</h4>
                  <p className="text-xs text-white/60 mb-2">{v.description}</p>
                  <a
                    href={v.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#D4AF37] hover:underline"
                  >
                    View Video Link ↗
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteItem('video', v.id)}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VENUE PHOTOS SUBTAB */}
      {activeTab === 'VENUE' && <VenuePhotosManager />}
    </div>
  );
}
