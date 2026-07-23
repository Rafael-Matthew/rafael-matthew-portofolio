import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit2, Trash2, X, Save, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

export default function SkillsManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleAddNew = () => {
    setFormData({
      name: '', category: 'Frontend', description: '', sort_order: 0, icon: ''
    });
    setEditingId('new');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    await supabase.from('skills').delete().eq('id', id);
    fetchSkills();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSave = { ...formData };
    
    if (selectedFile) {
      try {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        uploadData.append('folder', 'Portofolio/Skills');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to upload image');
        }

        dataToSave.icon = data.url;
      } catch (error: any) {
        alert('Error uploading image: ' + error.message);
        setSaving(false);
        return;
      }
    }

    let saveError = null;

    if (editingId === 'new') {
      const { data, error } = await supabase.from('skills').insert(dataToSave).select();
      saveError = error;
      if (!error && (!data || data.length === 0)) {
        saveError = new Error("Data was not saved. This usually means Row Level Security (RLS) blocked the action because you are not registered as an Admin in the database.");
      }
    } else {
      delete dataToSave.id;
      delete dataToSave.created_at;
      delete dataToSave.updated_at;
      const { data, error } = await supabase.from('skills').update(dataToSave).eq('id', editingId).select();
      saveError = error;
      if (!error && (!data || data.length === 0)) {
        saveError = new Error("Data was not updated. This usually means Row Level Security (RLS) blocked the action because you are not registered as an Admin in the database, or the record wasn't found.");
      }
    }
    
    setSaving(false);
    
    if (saveError) {
      console.error("Save error:", saveError);
      alert("Failed to save skill: " + saveError.message);
    } else {
      setEditingId(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchSkills();
    }
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

          <div className="space-y-4">
            <label className="text-sm font-medium text-text-main">Skill Icon</label>
            <div className="flex items-center gap-6 p-4 bg-white/30 border border-white/40 rounded-xl">
              {(previewUrl || formData.icon) ? (
                <div className="relative group">
                  <img src={previewUrl || formData.icon} alt="Skill Icon" className="w-16 h-16 object-contain rounded-lg bg-white/50 p-2" />
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData((prev: any) => ({ ...prev, icon: '' }));
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white/40 flex items-center justify-center text-text-muted">
                  <ImageIcon size={24} />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  className="hidden"
                  id="icon-upload"
                />
                <div className="flex gap-4">
                  <label 
                    htmlFor="icon-upload"
                    className={`cursor-pointer bg-white/60 hover:bg-white/80 border border-white/80 text-text-main font-medium py-2 px-4 rounded-lg transition-all flex items-center gap-2`}
                  >
                    <Upload size={16} />
                    {selectedFile ? 'Change Image' : 'Select Image'}
                  </label>
                  <input 
                    type="text"
                    name="icon"
                    value={formData.icon || ''}
                    onChange={handleChange}
                    placeholder="Or paste URL here"
                    className="flex-1 bg-white/50 border border-white/40 rounded-lg p-2 text-text-main text-sm focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <p className="text-xs text-text-muted mt-2">Recommended: PNG or SVG with transparent background, square ratio.</p>
              </div>
            </div>
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
              <th className="px-6 py-4 font-semibold w-16">Icon</th>
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">Skill Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {skills.map((skill) => (
              <tr key={skill.id} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4">
                  {skill.icon ? (
                    <img src={skill.icon} alt={skill.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-400">
                      <ImageIcon size={16} />
                    </div>
                  )}
                </td>
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
              <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No skills found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
