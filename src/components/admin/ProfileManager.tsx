import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Save, Loader2, UserCircle } from 'lucide-react';

export default function ProfileManager() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase.from('profiles').select('*').single();
      if (data) setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSave = { ...profile };
    // Process comma-separated strings
    if (typeof dataToSave.roles === 'string') {
      dataToSave.roles = dataToSave.roles.split(',').map((r: string) => r.trim()).filter(Boolean);
    }
    if (typeof dataToSave.badges === 'string') {
      dataToSave.badges = dataToSave.badges.split(',').map((b: string) => b.trim()).filter(Boolean);
    }

    delete dataToSave.id;
    delete dataToSave.created_at;
    delete dataToSave.updated_at;

    const { error } = await supabase.from('profiles').update(dataToSave).eq('id', profile.id);
    setSaving(false);
    
    if (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    } else {
      alert('Profile updated successfully!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-primary flex items-center gap-2 font-medium"><Loader2 className="animate-spin" /> Fetching identity data...</div>;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Profile Management</h1>
        <p className="text-text-muted">Update your core identity and hero section details.</p>
      </div>

      <form onSubmit={handleSave} className="glass-card p-8 space-y-8">
        <div className="flex items-center gap-4 pb-6 border-b border-white/30">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <UserCircle size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main">Core Identity</h2>
            <p className="text-text-muted text-sm">Main details shown across the portfolio.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Full Name</label>
            <input name="full_name" value={profile?.full_name || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Headline</label>
            <input name="headline" value={profile?.headline || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Email</label>
            <input name="email" value={profile?.email || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Location</label>
            <input name="location" value={profile?.location || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Status (e.g., Open to Work)</label>
            <input name="status" value={profile?.status || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Live Status</label>
            <input name="live_status" value={profile?.live_status || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Profile Image URL</label>
            <input name="profile_image_url" value={profile?.profile_image_url || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">CV / Resume URL</label>
            <input name="cv_url" value={profile?.cv_url || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">LinkedIn URL</label>
            <input name="linkedin_url" value={profile?.linkedin_url || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">GitHub URL</label>
            <input name="github_url" value={profile?.github_url || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Roles (comma separated)</label>
            <textarea name="roles" value={Array.isArray(profile?.roles) ? profile.roles.join(', ') : (profile?.roles || '')} onChange={handleChange} rows={2} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Focus Area</label>
            <textarea name="focus" value={profile?.focus || ''} onChange={handleChange} rows={2} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Badges (comma separated)</label>
            <textarea name="badges" value={Array.isArray(profile?.badges) ? profile.badges.join(', ') : (profile?.badges || '')} onChange={handleChange} rows={2} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main">Professional Summary</label>
          <textarea name="professional_summary" value={profile?.professional_summary || ''} onChange={handleChange} rows={4} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Technical Side</label>
            <textarea name="technical_side" value={profile?.technical_side || ''} onChange={handleChange} rows={5} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Personal Side</label>
            <textarea name="personal_side" value={profile?.personal_side || ''} onChange={handleChange} rows={5} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/30">
          <button type="submit" disabled={saving} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
