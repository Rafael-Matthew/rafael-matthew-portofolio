import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Briefcase, Code2, Users, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

type Persona = 'Recruiter' | 'Developer' | 'Client' | 'Lecturer';

export default function AILab({ projects }: { projects: Project[] }) {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const personas: { id: Persona; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'Recruiter', label: 'Recruiter', icon: <Briefcase className="w-5 h-5" />, desc: 'Focus on impact, roles, and employability.' },
    { id: 'Developer', label: 'Developer', icon: <Code2 className="w-5 h-5" />, desc: 'Focus on architecture, stack, and code.' },
    { id: 'Client', label: 'Client', icon: <Users className="w-5 h-5" />, desc: 'Focus on business value and problem-solving.' },
    { id: 'Lecturer', label: 'Lecturer', icon: <BookOpen className="w-5 h-5" />, desc: 'Focus on academic research and methodology.' },
  ];

  const recommendedProject = selectedPersona 
    ? projects.find(p => p.focus.includes(selectedPersona)) || projects[0]
    : null;

  return (
    <section id="ai-lab" className="py-20 px-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-accent">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-text-main">AI Lab</h2>
          <p className="text-text-muted">Project Recommender System</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-text-muted">
            Select your persona to let the system analyze your requirements and recommend the most relevant deployment from my portfolio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personas.map(persona => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona.id)}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all duration-300",
                  selectedPersona === persona.id
                    ? "border-accent bg-purple-50 shadow-md shadow-accent/10"
                    : "glass hover:border-accent/50"
                )}
              >
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3", 
                  selectedPersona === persona.id ? "bg-accent text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {persona.icon}
                </div>
                <h3 className="font-bold text-text-main">{persona.label}</h3>
                <p className="text-xs text-text-muted mt-1">{persona.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-[40px] -z-10" />
          
          <AnimatePresence mode="wait">
            {!selectedPersona ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-text-muted flex flex-col items-center"
              >
                <Zap className="w-12 h-12 mb-4 text-slate-300" />
                <p>Awaiting persona selection...</p>
              </motion.div>
            ) : recommendedProject ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold mb-2">
                  <Zap className="w-3.5 h-3.5" /> Recommended for {selectedPersona}
                </div>
                <h3 className="text-2xl font-bold text-text-main">{recommendedProject.name}</h3>
                <p className="text-sm font-medium text-primary">{recommendedProject.type}</p>
                
                <div className="bg-white/50 p-4 rounded-xl border border-white my-4">
                  <p className="text-sm text-text-muted leading-relaxed">
                    {selectedPersona === 'Recruiter' && recommendedProject.impact}
                    {selectedPersona === 'Developer' && `Built with ${recommendedProject.techStack.join(', ')}.`}
                    {selectedPersona === 'Client' && `Solves: ${recommendedProject.problem}`}
                    {selectedPersona === 'Lecturer' && recommendedProject.solution}
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    document.getElementById('deployment-zone')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-accent hover:text-purple-700 transition-colors"
                >
                  View Details in Deployment Zone <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
