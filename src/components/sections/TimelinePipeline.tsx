import React, { useState, useEffect } from 'react';
import { GitCommit, GitMerge, Rocket, PlayCircle, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

export type TimelineEvent = {
  id?: string;
  year: string;
  type: 'deploy' | 'commit' | 'merge' | 'init';
  message: string;
  details: string;
};

export default function TimelinePipeline({ projects = [], timelineEvents = [] }: { projects?: Project[], timelineEvents?: TimelineEvent[] }) {
  const [selectedYear, setSelectedYear] = useState<string>('');

  // Dynamically generate timeline events from projects
  const dynamicEvents = [...projects]
    .sort((a, b) => parseInt(b.period || '2024') - parseInt(a.period || '2024'))
    .map(project => {
      let type: 'deploy' | 'commit' | 'merge' = 'commit';
      if (project.status === 'Completed') type = 'deploy';
      else if (project.status === 'Active') type = 'commit';
      else if (project.status === 'Beta') type = 'merge';

      return {
        id: project.id,
        year: project.period || '2024',
        type,
        message: `Project: ${project.name}`,
        details: project.impact || project.problem || project.solution || `Developed ${project.name} as a ${project.type} project.`,
      } as TimelineEvent;
    });

  // Combine projects timeline with Supabase timeline events
  const fullTimelineEvents = [...dynamicEvents, ...timelineEvents];

  // Group events by year
  const groupedEvents = fullTimelineEvents.reduce((acc, event) => {
    if (!acc[event.year]) acc[event.year] = [];
    acc[event.year].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const sortedYears = Object.keys(groupedEvents).sort((a, b) => parseInt(b) - parseInt(a));

  useEffect(() => {
    if (!selectedYear && sortedYears.length > 0) {
      setSelectedYear(sortedYears[0]);
    }
  }, [sortedYears, selectedYear]);

  useEffect(() => {
    const handleOpenYear = (e: any) => {
      if (e.detail && e.detail.year) {
        setSelectedYear(e.detail.year);
      }
    };
    window.addEventListener('open-timeline-year', handleOpenYear as EventListener);
    return () => window.removeEventListener('open-timeline-year', handleOpenYear as EventListener);
  }, []);

  return (
    <section id="timeline-pipeline" className="py-20 px-4 w-full bg-section border-y border-slate-200/50 overflow-hidden">
      <div className="max-w-5xl mx-auto glass-card p-8 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text-main">Timeline Pipeline</h2>
              <p className="text-text-muted">Commit History & Milestones</p>
            </div>
          </div>

          {/* Year Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {sortedYears.map(year => (
              <span
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer select-none",
                  selectedYear === year 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-white text-text-muted border border-slate-200 hover:bg-slate-50 hover:text-text-main"
                )}
              >
                {year}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="relative ml-4 md:ml-6 pb-8">
          {/* Animated Vertical Line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: false }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute left-[-1px] top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-slate-200"
          />

          <AnimatePresence mode="wait">
            {selectedYear && (
              <motion.div
                key={selectedYear}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Year Marker */}
                <div className="relative pl-8 md:pl-12 pt-4 mb-6">
                  <div className="absolute -left-[11px] top-6 w-6 h-6 rounded-full bg-white border-4 border-primary flex items-center justify-center z-10" />
                  <h3 className="text-2xl font-black text-text-main tracking-tight">{selectedYear}</h3>
                </div>

                {/* Events for this year */}
                <div className="space-y-6">
                  {groupedEvents[selectedYear].map((event: any, index: number) => {
                    let Icon = GitCommit;
                    let color = "text-text-muted bg-slate-100";
                    let borderColor = "border-slate-200";

                    if (event.type === 'deploy') {
                      Icon = Rocket;
                      color = "text-white bg-primary shadow-lg shadow-primary/30";
                      borderColor = "border-primary/30";
                    } else if (event.type === 'merge') {
                      Icon = GitMerge;
                      color = "text-accent bg-accent/10";
                      borderColor = "border-accent/30";
                    } else if (event.type === 'init') {
                      Icon = PlayCircle;
                      color = "text-success bg-success/10";
                      borderColor = "border-success/30";
                    }

                    return (
                      <motion.div 
                        id={event.id}
                        key={event.message + index} 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative pl-8 md:pl-12"
                      >
                        {/* Node */}
                        <motion.div 
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: false, margin: "-50px" }}
                          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                          className={cn(
                            "absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 flex items-center justify-center z-10",
                            color,
                            borderColor
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </motion.div>

                        {/* Content */}
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="glass-card p-5 md:p-6 group relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-primary transition-colors" />
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                            <h3 className="text-lg font-bold text-text-main">{event.message}</h3>
                          </div>
                          <p className="text-text-muted leading-relaxed text-sm">
                            {event.details}
                          </p>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
