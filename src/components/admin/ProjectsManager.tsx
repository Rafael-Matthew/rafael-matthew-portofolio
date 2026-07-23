import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) console.error("Error fetching projects:", error);
    if (data) setProjects(data);
    setLoading(false);
  }

  const handleEdit = (project: any) => {
    setFormData(project);
    setEditingId(project.id);
  };

  const handleAddNew = () => {
    setFormData({
      title: '', slug: '', category: 'web app', status: 'Active', role: '', period: new Date().getFullYear().toString(),
      description: '', problem: '', solution: '', impact: '', 
      features: [], tech_stack: [], focus: [],
      github_url: '', live_demo_url: '', image_url: ''
    });
    setEditingId('new');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const dataToSave = { ...formData };
    
    // Process comma-separated strings to arrays for features, tech_stack, focus
    ['features', 'tech_stack', 'focus'].forEach(field => {
      if (typeof dataToSave[field] === 'string') {
        dataToSave[field] = dataToSave[field].split(',').map((f: string) => f.trim()).filter((f: string) => f);
      }
    });

    let saveError = null;

    if (editingId === 'new') {
      const { error } = await supabase.from('projects').insert(dataToSave);
      saveError = error;
    } else {
      delete dataToSave.id;
      delete dataToSave.created_at;
      delete dataToSave.updated_at;
      const { error } = await supabase.from('projects').update(dataToSave).eq('id', editingId);
      saveError = error;
    }
    
    if (saveError) {
      console.error("Save error:", saveError);
      alert("Failed to save project: " + saveError.message);
    } else {
      alert("Project saved successfully!");
      setEditingId(null);
      fetchProjects();
    }
    setSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return <div className="text-primary flex items-center gap-2"><Loader2 className="animate-spin" /> Loading projects...</div>;

  if (editingId) {
    return (
      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-6 border-b border-white/30 pb-4">
          <h2 className="text-2xl font-bold text-text-main">{editingId === 'new' ? 'Add New Project' : 'Edit Project'}</h2>
          <button onClick={() => setEditingId(null)} className="p-2 hover:bg-white/40 rounded-xl text-text-muted transition-colors"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Title</label>
              <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Slug (ID)</label>
              <input name="slug" value={formData.slug || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Category</label>
              <input name="category" value={formData.category || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="e.g. web app, games" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Status</label>
              <select name="status" value={formData.status || 'Active'} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Beta">Beta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Role</label>
              <input name="role" value={formData.role || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Period / Year</label>
              <input name="period" value={formData.period || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Repository URL</label>
              <input name="github_url" value={formData.github_url || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Live Demo URL</label>
              <input name="live_demo_url" value={formData.live_demo_url || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Cover Image URL</label>
              <input name="image_url" value={formData.image_url || ''} onChange={handleChange} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Short Description</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={2} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Problem Solved</label>
              <textarea name="problem" value={formData.problem || ''} onChange={handleChange} rows={3} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Solution Provided</label>
              <textarea name="solution" value={formData.solution || ''} onChange={handleChange} rows={3} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">Impact</label>
            <textarea name="impact" value={formData.impact || ''} onChange={handleChange} rows={2} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Tech Stack (comma separated)</label>
              <textarea name="tech_stack" value={Array.isArray(formData.tech_stack) ? formData.tech_stack.join(', ') : (formData.tech_stack || '')} onChange={handleChange} rows={3} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="React, Tailwind, Supabase" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Features (comma separated)</label>
              <textarea name="features" value={Array.isArray(formData.features) ? formData.features.join(', ') : (formData.features || '')} onChange={handleChange} rows={3} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Feature 1, Feature 2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Focus Area (comma separated)</label>
              <textarea name="focus" value={Array.isArray(formData.focus) ? formData.focus.join(', ') : (formData.focus || '')} onChange={handleChange} rows={3} className="w-full bg-white/50 border border-white/40 rounded-xl p-3 text-text-main focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Frontend, API" />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-white/30">
            <button type="submit" disabled={saving} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Project
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
          <h1 className="text-3xl font-bold text-text-main mb-2">Projects Manager</h1>
          <p className="text-text-muted">Manage projects for Deployment Zone & Cloud Intelligence.</p>
        </div>
        <button onClick={handleAddNew} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2">
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm text-text-muted">
          <thead className="bg-white/30 text-text-main uppercase text-xs border-b border-white/30">
            <tr>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4 text-text-main font-medium">{project.title}</td>
                <td className="px-6 py-4">{project.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button onClick={() => handleEdit(project)} className="text-primary hover:text-primary-dark p-1 bg-white/50 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700 p-1 bg-white/50 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-text-muted">No projects found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
