import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';

export default function TimelineManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data, error } = await supabase.from('timeline_events').select('*').order('sort_order', { ascending: true });
    if (data) setEvents(data);
    setLoading(false);
  }

  const handleEdit = (event: any) => {
    setFormData(event);
    setEditingId(event.id);
  };

  const handleAddNew = () => {
    setFormData({
      year: new Date().getFullYear().toString(),
      type: 'commit',
      message: '',
      details: '',
      sort_order: 0
    });
    setEditingId('new');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await supabase.from('timeline_events').delete().eq('id', id);
    fetchEvents();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingId === 'new') {
      await supabase.from('timeline_events').insert(formData);
    } else {
      await supabase.from('timeline_events').update(formData).eq('id', editingId);
    }
    
    setSaving(false);
    setEditingId(null);
    fetchEvents();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'sort_order' ? parseInt(e.target.value) : e.target.value;
    setFormData((prev: any) => ({ ...prev, [e.target.name]: value }));
  };

  if (loading) return <div className="text-primary flex items-center gap-2"><Loader2 className="animate-spin" /> Loading timeline events...</div>;

  if (editingId) {
    return (
      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-6 border-b border-white/30 pb-4">
          <h2 className="text-2xl font-bold text-text-main">{editingId === 'new' ? 'Add New Event' : 'Edit Event'}</h2>
          <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white/40 rounded-xl text-text-muted transition-colors"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Year</label>
              <input required name="year" value={formData.year || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Type</label>
              <select required name="type" value={formData.type || 'commit'} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all">
                <option value="commit">Commit</option>
                <option value="init">Init</option>
                <option value="deploy">Deploy</option>
                <option value="merge">Merge</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Sort Order</label>
              <input type="number" required name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Message (Title)</label>
            <input required name="message" value={formData.message || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Details</label>
            <textarea name="details" required value={formData.details || ''} onChange={handleChange} rows={3} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div className="flex justify-end pt-6 border-t border-white/30">
            <button type="submit" disabled={saving} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Event
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Timeline Manager</h1>
          <p className="text-text-muted">Manage events for Timeline Pipeline section.</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2">
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm text-text-muted">
          <thead className="bg-white/30 text-text-main uppercase text-xs border-b border-white/30">
            <tr>
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">Year</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Message</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4">{event.sort_order}</td>
                <td className="px-6 py-4">{event.year}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs bg-white/50 border border-white/40 text-text-main font-medium">
                    {event.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-main font-medium">{event.message}</td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button onClick={() => handleEdit(event)} className="text-primary hover:text-primary-dark p-1 bg-white/50 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-700 p-1 bg-white/50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No timeline events found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
