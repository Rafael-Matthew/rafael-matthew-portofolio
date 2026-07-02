import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Activity, 
  Server, 
  Cloud, 
  Zap, 
  CheckCircle2,
  Workflow,
  Network,
  Database,
  Box,
  Eye,
  FileText,
  MousePointer2,
  Settings,
  ArrowRight,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileCode2,
  User,
  Terminal,
  Layers,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

// --- DATA DEFINITIONS ---

type Experiment = {
  id: string;
  name: string;
  description: string;
  aiType: string;
  relatedProject: string;
  status: 'Active' | 'Prototype' | 'Concept' | 'Ready';
  icon: React.ElementType<{ className?: string }>;
  year?: string;
};

const experiments: Experiment[] = [
  {
    id: 'identity-core',
    name: 'Identity Core',
    description: 'The central hub of my professional identity and core principles.',
    aiType: 'Portfolio Intelligence',
    relatedProject: 'Rafael Matthew Portfolio',
    status: 'Active',
    icon: User
  },
  {
    id: 'tech-arsenal',
    name: 'Tech Arsenal',
    description: 'A comprehensive list of my technical skills, languages, and frameworks.',
    aiType: 'Portfolio Intelligence',
    relatedProject: 'Rafael Matthew Portfolio',
    status: 'Active',
    icon: Terminal
  },
  {
    id: 'deployment-zone',
    name: 'Deployment Zone',
    description: 'Showcasing my journey through various projects and real-world deployments.',
    aiType: 'Portfolio Intelligence',
    relatedProject: 'Rafael Matthew Portfolio',
    status: 'Active',
    icon: Layers
  },
  {
    id: 'start-handshake',
    name: 'Start Handshake',
    description: 'Initiate a connection, collaborate on a project, or just say hello.',
    aiType: 'Portfolio Intelligence',
    relatedProject: 'Rafael Matthew Portfolio',
    status: 'Active',
    icon: Briefcase
  }
];

const pipelineTemplates: Record<string, string[]> = {
  'default': ['Input Data', 'Pre-processing', 'AI Runtime', 'Cloud Function', 'Storage', 'Result', 'Monitoring'],
  'identity-core': ['Visitor Load', 'Profile Fetch', 'Identity Auth', 'Data Parse', 'Render Core', 'Display'],
  'tech-arsenal': ['Skill Query', 'Filter Category', 'Node Mapping', 'Skill Render', 'Hover Event', 'Display Detail'],
  'deployment-zone': ['Fetch Projects', 'Timeline Map', 'Sort Date', 'Render Node', 'Link Github', 'Project Ready'],
  'start-handshake': ['Connection Init', 'Form Load', 'Input Validate', 'Social Link', 'Message Queue', 'Handshake Send']
};

const runtimeMetricsData: Record<string, any> = {
  'default': { status: 'Active', layer: 'Ready', rules: '3 Enabled', sync: 'Online', latency: '128ms', service: 'ai-lab-vm' },
  'identity-core': { status: 'Active', layer: 'Core UI', rules: '2 Enabled', sync: 'Online', latency: '12ms', service: 'profile-edge' },
  'tech-arsenal': { status: 'Active', layer: 'Skill Matrix', rules: '4 Enabled', sync: 'Online', latency: '15ms', service: 'tech-graph' },
  'deployment-zone': { status: 'Active', layer: 'Project Graph', rules: '6 Enabled', sync: 'Online', latency: '34ms', service: 'deploy-router' },
  'start-handshake': { status: 'Active', layer: 'Contact Gateway', rules: '1 Enabled', sync: 'Online', latency: '22ms', service: 'contact-api' }
};

const insightsData: Record<string, any> = {
  'identity-core': {
    detected: 'Identity Profile and Core Values',
    focus: 'Presenting professional background and vision clearly',
    skills: 'Personal Branding, Communication, Vision',
    project: 'Rafael Matthew Portfolio',
    role: 'Central user identity rendering',
    action: 'Scroll to Identity Core'
  },
  'tech-arsenal': {
    detected: 'Comprehensive Technical Stack',
    focus: 'Organizing and rendering complex skill sets',
    skills: 'Full Stack, Cloud, AI, Databases',
    project: 'Rafael Matthew Portfolio',
    role: 'Interactive skill matrix rendering',
    action: 'Scroll to Tech Arsenal'
  },
  'deployment-zone': {
    detected: 'Project Deployment and Timeline',
    focus: 'Showcasing real-world impact and project delivery',
    skills: 'Project Management, Deployment, Full Cycle',
    project: 'Rafael Matthew Portfolio',
    role: 'Project history timeline visualization',
    action: 'Scroll to Deployment Zone'
  },
  'start-handshake': {
    detected: 'Networking and Collaboration Gateway',
    focus: 'Facilitating professional connections and opportunities',
    skills: 'Networking, Communication, Collaboration',
    project: 'Rafael Matthew Portfolio',
    role: 'Client connection and message routing',
    action: 'Scroll to Start Handshake'
  }
};

const statusColors = {
  Active: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
  Prototype: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  Concept: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20',
  Ready: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20'
};

// --- COMPONENT ---

export default function CloudIntelligenceEngine({ projects = [] }: { projects?: Project[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [simStep, setSimStep] = useState<number>(-1);

  const dbExperiments: Experiment[] = projects.map(p => ({
    id: p.id,
    name: p.name,
    description: p.problem || `Analyzing workflow for ${p.name}`,
    aiType: p.type || 'Data Pipeline',
    relatedProject: p.name,
    status: p.status === 'Completed' ? 'Ready' : p.status === 'Beta' ? 'Prototype' : 'Active',
    icon: Database,
    year: p.period || '2024'
  }));

  const allExperiments = [...dbExperiments, ...experiments];

  const groupedExperiments = React.useMemo(() => {
    return allExperiments.reduce((acc, exp) => {
      const type = exp.aiType || 'Uncategorized';
      if (!acc[type]) acc[type] = [];
      acc[type].push(exp);
      return acc;
    }, {} as Record<string, Experiment[]>);
  }, [allExperiments]);

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const isFolderOpen = (folder: string) => openFolders[folder] !== false;

  const toggleFolder = (folder: string) => {
    setOpenFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const activePipeline = pipelineTemplates[selectedId || 'default'] || pipelineTemplates['default'];
  const activeMetrics = runtimeMetricsData[selectedId || 'default'] || runtimeMetricsData['default'];
  
  const activeInsight = selectedId 
    ? (insightsData[selectedId] || {
        detected: `Pipeline analysis for ${allExperiments.find(e => e.id === selectedId)?.name}`,
        focus: allExperiments.find(e => e.id === selectedId)?.description || 'Data processing',
        skills: 'Cloud Integration, Workflow Automation',
        project: allExperiments.find(e => e.id === selectedId)?.relatedProject || 'Unknown',
        role: 'Dynamic cloud workflow execution',
        action: 'View Project Details',
        targetId: 'deployment-zone',
        year: allExperiments.find(e => e.id === selectedId)?.year
      })
    : null;

  useEffect(() => {
    if (selectedId) {
      setSimStep(0);
      const interval = setInterval(() => {
        setSimStep(prev => {
          if (prev < activePipeline.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 600);
      return () => clearInterval(interval);
    } else {
      setSimStep(-1);
    }
  }, [selectedId, activePipeline.length]);

  const isCompleted = simStep >= activePipeline.length;

  return (
    <section id="cloud-intelligence" className="py-24 px-4 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 glass-card p-8 md:p-12">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold border border-[#2563EB]/20">
            <Workflow className="w-4 h-4" /> Cloud Intelligence Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">AI Workflow Lab</h2>
          <p className="text-[#64748B] max-w-2xl text-sm md:text-base">
            A visual AI workflow lab for experimenting with inference pipelines, automation, cloud runtime, and intelligent system design.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
          
          {/* 1. AI Experiment Gallery */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#64748B] flex items-center gap-2 mb-1">
              <Box className="w-4 h-4" /> Experiment Gallery
            </h3>
            
            <div className="flex flex-col gap-1 max-h-[350px] lg:max-h-none lg:h-[500px] overflow-y-auto pr-2 custom-scrollbar font-mono">
              {Object.entries(groupedExperiments).map(([folderName, exps]) => (
                <div key={folderName} className="flex flex-col mb-1">
                  
                  {/* Folder Header */}
                  <div 
                    role="button"
                    onClick={() => toggleFolder(folderName)}
                    className="flex items-center gap-1.5 px-2 py-1.5 w-full text-left hover:bg-slate-200/50 rounded transition-all group cursor-pointer select-none"
                  >
                    {isFolderOpen(folderName) ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    
                    {isFolderOpen(folderName) ? (
                      <FolderOpen className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                    ) : (
                      <Folder className="w-4 h-4 text-slate-500 fill-slate-500/20" />
                    )}
                    <span className="text-sm text-slate-700">{folderName.toLowerCase()}</span>
                  </div>
                  
                  {/* Folder Contents */}
                  <AnimatePresence>
                    {isFolderOpen(folderName) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col pl-6 ml-1.5 border-l border-slate-300/50 overflow-hidden"
                      >
                        {exps.map(exp => {
                          const isSelected = selectedId === exp.id;
                          const Icon = exp.icon || FileCode2;
                          // Convert name to a slug format without extension
                          const fileName = exp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                          
                          return (
                            <div
                              role="button"
                              key={exp.id}
                              onClick={() => setSelectedId(exp.id)}
                              className={cn(
                                "flex items-center gap-2 text-left px-2 py-1.5 rounded transition-all duration-200 cursor-pointer select-none",
                                isSelected 
                                  ? "bg-blue-100/50 text-blue-700" 
                                  : "hover:bg-slate-200/50 text-slate-600"
                              )}
                            >
                              <Icon className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-blue-600" : "text-slate-400")} />
                              <span className={cn("text-xs truncate", isSelected ? "font-semibold" : "font-medium")}>
                                {fileName}
                              </span>
                            </div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Visual Inference Pipeline */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#64748B] flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4" /> Visual Inference Pipeline
            </h3>
            <div className="flex-1 bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm relative overflow-hidden p-6 md:p-8 flex items-center justify-center min-h-[400px]">
              
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              {/* Pipeline Container */}
              <div className="relative z-10 w-full max-w-lg flex flex-col gap-4 relative">
                {activePipeline.map((nodeName, idx) => {
                  const isActive = simStep === idx;
                  const isDone = simStep > idx;
                  const isPending = simStep < idx;

                  return (
                    <div key={`${selectedId}-${idx}`} className="flex items-center gap-4 relative">
                      {/* Connection Line (except for last node) */}
                      {idx !== activePipeline.length - 1 && (
                        <div className="absolute left-6 top-10 bottom-[-16px] w-0.5 bg-slate-100 z-0">
                          {isDone && (
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: '100%' }}
                              className="w-full bg-[#2563EB]"
                            />
                          )}
                        </div>
                      )}
                      
                      {/* Node Circle */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 z-10 shrink-0",
                        isDone ? "bg-white/90 border-[#2563EB] text-[#2563EB] shadow-sm shadow-[#2563EB]/20" : 
                        isActive ? "bg-white/90 border-[#06B6D4] text-[#06B6D4] scale-110 shadow-md shadow-[#06B6D4]/30" : 
                        "bg-white/60 border-white/60 text-slate-400"
                      )}>
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : 
                         isActive ? <Zap className="w-5 h-5 animate-pulse" /> : 
                         <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />}
                      </div>
                      
                      {/* Node Label Card */}
                      <div className={cn(
                        "flex-1 p-3 rounded-lg border transition-all duration-300",
                        isDone ? "bg-white/80 border-white/60 text-[#0F172A] shadow-sm" :
                        isActive ? "bg-white/90 border-[#06B6D4] text-[#0F172A] shadow-md" :
                        "bg-white/40 border-white/30 text-slate-500 opacity-80"
                      )}>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm">{nodeName}</span>
                          <span className="text-[10px] font-medium uppercase tracking-wider">
                            {isDone ? 'Completed' : isActive ? 'Processing' : 'Waiting'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* 3 & 4. Metrics & Insights */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* 3. Cloud Runtime Metrics */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#64748B] flex items-center gap-2 mb-1">
                <Server className="w-4 h-4" /> Cloud Runtime
              </h3>
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 text-white shadow-lg border border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4">
                  <div className={cn("w-2 h-2 rounded-full", activeMetrics.status.includes('Active') ? "bg-[#22C55E] animate-pulse" : "bg-[#06B6D4] animate-pulse")} />
                  <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">System Status</span>
                  <span className="ml-auto text-xs font-bold">{activeMetrics.status}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 gap-y-5">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Layer</p>
                    <p className="text-sm font-medium">{activeMetrics.layer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Latency</p>
                    <p className="text-sm font-medium text-[#06B6D4]">{activeMetrics.latency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Rules</p>
                    <p className="text-sm font-medium">{activeMetrics.rules}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Sync</p>
                    <p className="text-sm font-medium text-[#22C55E] flex items-center gap-1">
                      <Cloud className="w-3 h-3" /> {activeMetrics.sync}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Service Map</p>
                    <p className="text-xs font-mono text-slate-300 bg-white/5 p-2 rounded border border-white/10">
                      {activeMetrics.service}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Experiment Result Insight */}
            <div className="flex flex-col gap-3 flex-1">
              <h3 className="text-sm font-bold text-[#64748B] flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4" /> Result Insight
              </h3>
              <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/40 p-5 shadow-sm flex-1 flex flex-col justify-center">
                {!activeInsight ? (
                  <div className="text-center text-slate-400 flex flex-col items-center gap-2">
                    <Activity className="w-8 h-8 opacity-20" />
                    <p className="text-sm">Select an experiment<br/>to view insights.</p>
                  </div>
                ) : !isCompleted ? (
                  <div className="text-center text-[#2563EB] flex flex-col items-center gap-3">
                    <Zap className="w-6 h-6 animate-pulse" />
                    <p className="text-sm font-medium animate-pulse">Analyzing pipeline output...</p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Detected Capability</p>
                      <p className="text-sm font-bold text-[#0F172A]">{activeInsight.detected}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Engineering Focus</p>
                      <p className="text-xs text-[#64748B]">{activeInsight.focus}</p>
                    </div>
                    <div className="bg-[#EAF4FF] p-3 rounded-xl border border-[#2563EB]/20">
                      <p className="text-[10px] text-[#2563EB] font-bold uppercase mb-1">Related Project</p>
                      <p className="text-sm font-bold text-[#0F172A]">{activeInsight.project}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Cloud Role</p>
                      <p className="text-xs text-[#64748B]">{activeInsight.role}</p>
                    </div>
                    <div className="pt-2 mt-auto border-t border-slate-100">
                      <div 
                        role="button"
                        onClick={() => {
                          if (selectedId) {
                            const insight = activeInsight;
                            // Jika ada tahun, kirim event agar TimelinePipeline membuka tab tahun yang benar
                            if (insight.year) {
                               window.dispatchEvent(new CustomEvent('open-timeline-year', { detail: { year: insight.year } }));
                            }
                            
                            // Kirim event agar Deployment Zone membuka proyek ini
                            window.dispatchEvent(new CustomEvent('open-deployment-project', { detail: { projectId: selectedId } }));
                            
                            // Beri waktu 150ms agar DOM sempat melakukan render
                            setTimeout(() => {
                              const scrollTargetId = insight.targetId || selectedId;
                              const element = document.getElementById(scrollTargetId);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                
                                // Efek Highlight sejenak
                                element.style.transition = 'all 0.5s ease';
                                const oldBg = element.style.backgroundColor;
                                element.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
                                element.style.borderRadius = '1rem';
                                setTimeout(() => {
                                  element.style.backgroundColor = oldBg;
                                }, 2000);
                              } else {
                                // Fallback jika project tidak ditemukan
                                document.getElementById('timeline-pipeline')?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 150);
                          }
                        }}
                        className="w-full text-xs font-bold text-[#2563EB] hover:text-[#2563EB]/80 flex items-center justify-between p-2 hover:bg-[#2563EB]/5 rounded-lg transition-colors cursor-pointer select-none"
                      >
                        {activeInsight.action} <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Intelligence Automation Flow */}
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-[#8B5CF6]" /> Intelligence Automation Flow
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Rule 1 */}
            <div className="p-3 rounded-xl border border-white/40 bg-white/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Trigger</span>
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-sm", selectedId ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-slate-200 text-slate-500")}>
                  {selectedId ? 'Completed' : 'Waiting'}
                </span>
              </div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">Experiment Selected</p>
              <p className="text-[10px] text-slate-500">Init pipeline simulation</p>
            </div>

            {/* Rule 2 */}
            <div className="p-3 rounded-xl border border-white/40 bg-white/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Trigger</span>
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-sm", 
                  isCompleted ? "bg-[#22C55E]/10 text-[#22C55E]" : 
                  (selectedId && simStep > 0 ? "bg-[#06B6D4]/10 text-[#06B6D4]" : "bg-slate-200 text-slate-500")
                )}>
                  {isCompleted ? 'Completed' : (selectedId && simStep > 0 ? 'Running' : 'Waiting')}
                </span>
              </div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">Pipeline Completed</p>
              <p className="text-[10px] text-slate-500">Generate experiment insight</p>
            </div>

            {/* Rule 3 */}
            <div className="p-3 rounded-xl border border-white/40 bg-white/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Trigger</span>
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-sm", selectedId ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-slate-200 text-slate-500")}>
                  {selectedId ? 'Completed' : 'Waiting'}
                </span>
              </div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">Metrics Updated</p>
              <p className="text-[10px] text-slate-500">Sync runtime metrics</p>
            </div>

            {/* Rule 4 */}
            <div className="p-3 rounded-xl border border-white/40 bg-white/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Trigger</span>
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-sm", isCompleted ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-slate-200 text-slate-500")}>
                  {isCompleted ? 'Ready' : 'Waiting'}
                </span>
              </div>
              <p className="text-xs font-bold text-[#0F172A] mb-1">Related Project Mapped</p>
              <p className="text-[10px] text-slate-500">Suggest project connection</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
