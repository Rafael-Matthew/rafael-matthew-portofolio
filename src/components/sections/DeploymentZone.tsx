import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, ExternalLink, Terminal, CheckCircle2, CircleDashed } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

export default function DeploymentZone({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeploying(true);
    setDeployLogs([]);

    const logs = [
      `Connecting to instance: ${project.id}...`,
      "Fetching architecture details...",
      "Loading tech stack modules...",
      "Rendering deployment preview...",
      "Status: ACTIVE"
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setDeployLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setTimeout(() => setIsDeploying(false), 500);
        }
      }, index * 400);
    });
  };

  return (
    <section id="deployment-zone" className="py-20 px-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Server className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-text-main">Deployment Zone</h2>
          <p className="text-text-muted">Active Systems & Projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Project List & Filters */}
        <div className="md:col-span-5 h-[600px] flex flex-col">
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4 shrink-0">
            {['All', ...Array.from(new Set(projects.map(p => p.type || 'Others')))].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                  selectedCategory === category 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Scrollable Project List */}
          <div className="overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4 flex-1">
            {projects
              .filter(p => selectedCategory === 'All' || (p.type || 'Others') === selectedCategory)
              .map((project) => (
                <div 
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={cn(
                    "glass-card p-4 cursor-pointer shrink-0",
                    selectedProject?.id === project.id ? "border-primary shadow-lg shadow-primary/10" : ""
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-text-main">{project.name}</h3>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-2",
                      project.status === 'Active' ? "bg-success/10 text-success" : 
                      project.status === 'Completed' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                    )}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-3">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Project Details (Deployment View) */}
        <div className="md:col-span-7">
          <div className="glass h-full min-h-[400px] rounded-3xl p-6 relative overflow-hidden flex flex-col">
            {!selectedProject ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted opacity-50">
                <Server className="w-16 h-16 mb-4 opacity-50" />
                <p>Select a deployment to view details</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {isDeploying ? (
                  <motion.div 
                    key="deploying"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-sm space-y-2 text-text-muted h-full flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                      <Terminal className="w-5 h-5" /> Deployment Log
                    </div>
                    {deployLogs.map((log, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-2"
                      >
                        <span className="text-secondary">{`>`}</span> {log}
                      </motion.div>
                    ))}
                    <motion.div 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-2 h-4 bg-primary mt-2"
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-text-main mb-1">{selectedProject.name}</h3>
                        <p className="text-primary font-medium text-sm">{selectedProject.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <a href={selectedProject.githubUrl} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-text-muted hover:text-text-main hover:bg-slate-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                        </a>
                        <a href={selectedProject.demoUrl} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pr-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Problem</h4>
                        <p className="text-sm text-text-muted leading-relaxed">{selectedProject.problem}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Solution</h4>
                        <p className="text-sm text-text-muted leading-relaxed">{selectedProject.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Features</h4>
                        <ul className="space-y-1">
                          {selectedProject.keyFeatures.map((feature, i) => (
                            <li key={i} className="text-sm text-text-muted flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Impact</h4>
                        <p className="text-sm font-medium text-text-main">{selectedProject.impact}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2 flex-wrap">
                      {selectedProject.techStack.map((tech, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 font-medium shadow-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
