import React from 'react';
import { timelineEvents } from '@/data/timeline';
import { GitCommit, GitMerge, Rocket, PlayCircle, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TimelinePipeline() {
  return (
    <section id="timeline-pipeline" className="py-20 px-4 w-full bg-section border-y border-slate-200/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text-main">Timeline Pipeline</h2>
            <p className="text-text-muted">Commit History & Milestones</p>
          </div>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-12 pb-8">
          {timelineEvents.map((event, index) => {
            let Icon = GitCommit;
            let color = "text-text-muted bg-slate-100";
            let borderColor = "border-slate-200";

            if (event.type === 'deploy') {
              Icon = Rocket;
              color = "text-white bg-primary";
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
              <div key={index} className="relative pl-8 md:pl-12">
                {/* Node */}
                <div className={cn(
                  "absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 flex items-center justify-center",
                  color,
                  borderColor
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Content */}
                <div className="glass-card p-5 md:p-6 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-primary transition-colors" />
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <span className="font-mono text-sm font-bold text-primary bg-primary/5 px-2 py-1 rounded inline-block w-fit">
                      {event.year}
                    </span>
                    <h3 className="text-lg font-bold text-text-main">{event.message}</h3>
                  </div>
                  <p className="text-text-muted leading-relaxed text-sm">
                    {event.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
