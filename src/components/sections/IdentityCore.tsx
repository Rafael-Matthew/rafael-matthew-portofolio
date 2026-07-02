import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { profile } from '@/data/profile';
import { User, Code2, Heart, MapPin, Activity, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'professional' | 'technical' | 'personal';

export default function IdentityCore() {
  const [activeTab, setActiveTab] = useState<Tab>('professional');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'professional', label: 'Professional Summary', icon: <User className="w-4 h-4" /> },
    { id: 'technical', label: 'Technical Side', icon: <Code2 className="w-4 h-4" /> },
    { id: 'personal', label: 'Personal Side', icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <section id="identity-core" className="py-20 px-4 w-full">
      <div className="max-w-5xl mx-auto glass-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-text-main">Identity Core</h2>
          <p className="text-text-muted">System Profile & Focus Areas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Card: Main System Info */}
        <div className="glass-card p-6 md:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg shadow-primary/20 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-text-main">{profile.name}</h3>
            </div>
            
            <p className="text-primary font-medium text-sm mb-4 text-left">{profile.roles.join(' + ')}</p>
            
            <div className="space-y-3 text-sm text-text-muted text-left">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" /> {profile.location}
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-success" /> {profile.status}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-left">
            <p className="text-xs text-text-muted font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-primary font-bold">Focus:</span> {profile.focus}
              <br/>
              <span className="text-secondary font-bold mt-2 block">Live Status:</span>
              {profile.liveStatus}
            </p>
          </div>
        </div>

        {/* Right Card: Tabs & Content */}
        <div className="glass-card p-6 md:col-span-8 flex flex-col">
          <div className="flex overflow-x-auto no-scrollbar justify-between md:justify-start gap-2 mb-6 border-b border-slate-100 pb-4">
            {tabs.map(tab => (
              <div
                role="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer select-none flex-1 md:flex-none justify-center md:justify-start",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-md" 
                    : "text-text-muted hover:bg-slate-50 hover:text-text-main"
                )}
              >
                {tab.icon} <span className="hidden md:block">{tab.label}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 relative min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full text-text-muted leading-relaxed"
              >
                {activeTab === 'professional' && (
                  <div className="space-y-4">
                    <h4 className="md:hidden font-bold text-text-main text-lg mb-2">Professional Summary</h4>
                    <p>{profile.professionalSummary}</p>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-primary mt-4 text-sm font-medium">
                      ✨ Quick Highlight: Proven track record in delivering scalable full-stack applications with measurable impact on operational efficiency.
                    </div>
                  </div>
                )}
                {activeTab === 'technical' && (
                  <div className="space-y-4">
                    <h4 className="md:hidden font-bold text-text-main text-lg mb-2">Technical Side</h4>
                    <p>{profile.technicalSide}</p>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-primary mt-4 text-sm font-mono">
                      // Dev Note: Heavily utilizing TypeScript for end-to-end type safety, deploying via Vercel Edge Functions, and managing state with Zustand/Nanostores.
                    </div>
                  </div>
                )}
                {activeTab === 'personal' && (
                  <div className="space-y-4">
                    <h4 className="md:hidden font-bold text-text-main text-lg mb-2">Personal Side</h4>
                    <p>{profile.personalSide}</p>
                    <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-accent mt-4 text-sm">
                      🎮 Fun Fact: I spend my free time exploring new UI animations and optimizing terminal configurations!
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-text-muted border border-slate-200">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
