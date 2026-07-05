import React from 'react';
import { LayoutDashboard, User, FolderKanban, Code2, Clock, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminSidebar({ currentPath }: { currentPath: string }) {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/matthew' },
    { name: 'Profile', icon: User, path: '/admin/matthew/profile' },
    { name: 'Projects', icon: FolderKanban, path: '/admin/matthew/projects' },
    { name: 'Skills', icon: Code2, path: '/admin/matthew/skills' },
    { name: 'Timeline', icon: Clock, path: '/admin/matthew/timeline' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/matthew/login';
  };

  return (
    <div className="w-64 shrink-0 glass h-screen sticky top-0 flex flex-col font-sans text-sm z-50">
      <div className="p-6 border-b border-white/30">
        <h1 className="text-xl font-bold text-gradient tracking-tight">
          CloudVerse OS
        </h1>
        <p className="text-xs text-text-muted mt-1">Admin Terminal v1.0</p>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium border border-primary/20 shadow-sm'
                  : 'text-text-muted hover:bg-white/50 hover:text-text-main'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/30">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
