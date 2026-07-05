import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';

export default function SkillsManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    setLoading(true);
    const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
    if (data) setSkills(data);
    setLoading(false);
  }

  const handleEdit = (skill: any) => {
    setFormData(skill);
    setEditingId(skill.id);
  };

  const handleAddNew = () => {
    setFormData({
      name: '', category: 'Frontend', description: '', level: 'Intermediate', sort_order: 0
    });
    setEditingId('new');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    await supabase.from('skills').delete().eq('id', id);
    fetchSkills();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingId === 'new') {
      await supabase.from('skills').insert(formData);
    } else {
      await supabase.from('skills').update(formData).eq('id', editingId);
    }
    
    setSaving(false);
    setEditingId(null);
    fetchSkills();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'sort_order' ? parseInt(e.target.value) : e.target.value;
    setFormData((prev: any) => ({ ...prev, [e.target.name]: value }));
  };

  if (loading) return <div className="text-primary flex items-center gap-2"><Loader2 className="animate-spin" /> Loading skills...</div>;

  if (editingId) {
    return (
      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-6 border-b border-white/30 pb-4">
          <h2 className="text-2xl font-bold text-text-main">{editingId === 'new' ? 'Add New Skill' : 'Edit Skill'}</h2>
          <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white/40 rounded-xl text-text-muted transition-colors"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Name</label>
              <input required name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Category</label>
              <input required name="category" value={formData.category || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="e.g. Frontend, Backend, Languages" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Sort Order</label>
              <input type="number" required name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div className="flex justify-end pt-6 border-t border-white/30">
            <button type="submit" disabled={saving} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Skill
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
          <h1 className="text-3xl font-bold text-text-main mb-2">Skills Manager</h1>
          <p className="text-text-muted">Manage cards for Tech Arsenal section.</p>
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
              <th className="px-6 py-4 font-semibold">Skill Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4">{skill.sort_order}</td>
                <td className="px-6 py-4 text-text-main font-medium">{skill.name}</td>
                <td className="px-6 py-4">{skill.category}</td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button onClick={() => handleEdit(skill)} className="text-primary hover:text-primary-dark p-1 bg-white/50 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:text-red-700 p-1 bg-white/50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {skills.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-text-muted">No skills found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
