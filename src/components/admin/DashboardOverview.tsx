import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FolderKanban, Code2, Clock, Activity, Loader2 } from 'lucide-react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, timeline: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [projRes, skillRes, timeRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('timeline_events').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        projects: projRes.count || 0,
        skills: skillRes.count || 0,
        timeline: timeRes.count || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-primary flex items-center gap-2 font-medium"><Loader2 className="animate-spin" /> Loading system metrics...</div>;
  }

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderKanban, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Active Skills', value: stats.skills, icon: Code2, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Timeline Events', value: stats.timeline, icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">System Dashboard</h1>
        <p className="text-text-muted">Welcome to CloudVerse OS Admin Terminal. System is running nominally.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-text-muted text-sm font-medium">{card.label}</p>
                <h3 className="text-3xl font-bold text-text-main mt-1">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/30">
          <Activity className="text-success" />
          <h2 className="text-xl font-bold text-text-main">System Status</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-text-main font-medium">Database Connection</span>
            </div>
            <span className="text-success font-mono text-sm bg-success/10 px-3 py-1 rounded-full">Stable</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/40 rounded-xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-text-main font-medium">Authentication Service</span>
            </div>
            <span className="text-success font-mono text-sm bg-success/10 px-3 py-1 rounded-full">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
