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
  FileCode2
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
  icon: React.ElementType;
};

const experiments: Experiment[] = [
  {
    id: 'routing',
    name: 'Smart Portfolio Routing',
    description: 'Routes visitor intent into the most relevant portfolio sections.',
    aiType: 'Intent Mapping',
    relatedProject: 'CloudVerse Portfolio',
    status: 'Active',
    icon: Network
  },
  {
    id: 'posture',
    name: 'Computer Vision Posture Lab',
    description: 'Simulates visual analysis workflow for sport posture evaluation.',
    aiType: 'Computer Vision',
    relatedProject: 'AI Billiard Coach',
    status: 'Prototype',
    icon: Eye
  },
  {
    id: 'insight',
    name: 'Document Insight Extractor',
    description: 'Converts unstructured documents into structured summaries and key insights.',
    aiType: 'NLP / Information Extraction',
    relatedProject: 'Academic & Productivity Tools',
    status: 'Concept',
    icon: FileText
  },
  {
    id: 'reco',
    name: 'Project Recommendation Engine',
    description: 'Matches project showcases based on visitor intent signals.',
    aiType: 'Recommendation Logic',
    relatedProject: 'CloudVerse Portfolio',
    status: 'Active',
    icon: MousePointer2
  },
  {
    id: 'deploy',
    name: 'Cloud AI Deployment Flow',
    description: 'Shows how AI features connect with API, storage, automation, and monitoring.',
    aiType: 'AI System Architecture',
    relatedProject: 'Cloud AI Workflow',
    status: 'Ready',
    icon: Box
  }
];

const pipelineTemplates: Record<string, string[]> = {
  'default': ['Input Data', 'Pre-processing', 'AI Runtime', 'Cloud Function', 'Storage', 'Result', 'Monitoring'],
  'routing': ['Visitor Intent', 'Intent Mapping', 'Route Engine', 'Section Match', 'Recommended Path', 'Interaction Tracking'],
  'posture': ['Image / Video', 'Pose Detection', 'Feature Extractor', 'AI Analysis', 'Feedback Result', 'Performance Monitor'],
  'insight': ['Document Input', 'Text Parsing', 'Entity Detection', 'Insight Extraction', 'Structured Summary', 'Export Result'],
  'reco': ['Visitor Role', 'Preference Signal', 'Project Scoring', 'Recommend Logic', 'Best Match', 'CTA Suggestion'],
  'deploy': ['AI Request', 'API Gateway', 'Model Runtime', 'Serverless Fn', 'Cloud Storage', 'Monitoring Logs']
};

const runtimeMetricsData: Record<string, any> = {
  'default': { status: 'Active', layer: 'Ready', rules: '3 Enabled', sync: 'Online', latency: '128ms', service: 'ai-lab-vm' },
  'routing': { status: 'Active', layer: 'Intent Engine', rules: '4 Enabled', sync: 'Online', latency: '64ms', service: 'router-vm' },
  'posture': { status: 'Prototype Running', layer: 'Vision Pipeline', rules: '2 Enabled', sync: 'Online', latency: '182ms', service: 'ai-lab-vm / vision-node' },
  'insight': { status: 'Concept Ready', layer: 'NLP Pipeline', rules: '3 Enabled', sync: 'Online', latency: '146ms', service: 'document-insight-node' },
  'reco': { status: 'Active', layer: 'Scoring Engine', rules: '5 Enabled', sync: 'Online', latency: '89ms', service: 'reco-engine-vm' },
  'deploy': { status: 'Ready', layer: 'System Arch', rules: '8 Enabled', sync: 'Online', latency: '42ms', service: 'api-gateway' }
};

const insightsData: Record<string, any> = {
  'routing': {
    detected: 'AI-like decision flow and user intent mapping',
    focus: 'Turning visitor intent into personalized portfolio navigation',
    skills: 'TypeScript, UI State, Recommendation Logic, Automation',
    project: 'CloudVerse Portfolio',
    role: 'Client-side intelligence layer with cloud-inspired routing',
    action: 'Explore Deployment Zone'
  },
  'posture': {
    detected: 'Computer vision workflow design',
    focus: 'Processing visual input into structured posture feedback',
    skills: 'MediaPipe, AI Analysis, Kotlin, Computer Vision Basics',
    project: 'AI Billiard Coach',
    role: 'Runtime processing, storage, and monitoring pipeline',
    action: 'View AI Billiard Coach deployment'
  },
  'insight': {
    detected: 'Information extraction and summarization',
    focus: 'Parsing unstructured text into structured insights',
    skills: 'NLP Concepts, Text Parsing, Data Structuring',
    project: 'Academic & Productivity Tools',
    role: 'Data processing pipeline and structured storage',
    action: 'View related academic projects'
  },
  'reco': {
    detected: 'Intent-based matching and recommendation',
    focus: 'Scoring items based on multi-dimensional user signals',
    skills: 'Recommendation Algorithms, Scoring Logic, UX Design',
    project: 'CloudVerse Portfolio',
    role: 'Personalization engine acting as edge middleware',
    action: 'Try filtering projects'
  },
  'deploy': {
    detected: 'End-to-end cloud AI integration',
    focus: 'Connecting serverless, models, storage, and APIs',
    skills: 'System Design, Serverless, Cloud Storage, MLOps basics',
    project: 'Cloud AI Workflow',
    role: 'Orchestrating cloud resources for AI workloads',
    action: 'View architectural diagrams'
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
    icon: Database
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
        action: 'View Project Details'
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
            <div className="flex flex-col gap-2 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(groupedExperiments).map(([folderName, exps]) => (
                <div key={folderName} className="flex flex-col gap-2 mb-1">
                  
                  {/* Folder Header */}
                  <button 
                    onClick={() => toggleFolder(folderName)}
                    className="flex items-center gap-2 px-2 py-2 w-full text-left hover:bg-white/40 rounded-xl transition-all group"
                  >
                    {isFolderOpen(folderName) ? (
                      <FolderOpen className="w-4 h-4 text-[#2563EB] fill-[#2563EB]/20" />
                    ) : (
                      <Folder className="w-4 h-4 text-slate-500 fill-slate-500/20 group-hover:text-[#2563EB]" />
                    )}
                    <span className="font-bold text-sm text-[#0F172A]">{folderName}</span>
                    <span className="ml-auto text-[10px] bg-white/50 border border-white/40 px-1.5 py-0.5 rounded-md text-slate-500 font-bold">
                      {exps.length}
                    </span>
                  </button>
                  
                  {/* Folder Contents */}
                  <AnimatePresence>
                    {isFolderOpen(folderName) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-2 pl-3 border-l-2 border-[#2563EB]/10 ml-4 overflow-hidden"
                      >
                        {exps.map(exp => {
                          const isSelected = selectedId === exp.id;
                          const Icon = exp.icon || FileText;
                          
                          return (
                            <button
                              key={exp.id}
                              onClick={() => setSelectedId(exp.id)}
                              className={cn(
                                "text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                                isSelected 
                                  ? "bg-white/80 border-[#2563EB] shadow-md shadow-[#2563EB]/10 ring-1 ring-[#2563EB]/50 backdrop-blur-md text-slate-800" 
                                  : "bg-white/40 border-white/40 hover:bg-white/60 hover:border-white/60 hover:shadow-sm backdrop-blur-sm text-slate-700"
                              )}
                            >
                              {isSelected && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#2563EB]/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
                              )}
                              <div className="flex justify-between items-start mb-2">
                                <div className={cn(
                                  "p-1.5 rounded-lg",
                                  isSelected ? "bg-[#2563EB]/10 text-[#2563EB]" : "bg-white/50 border border-white/50 text-slate-600"
                                )}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", statusColors[exp.status])}>
                                  {exp.status}
                                </span>
                              </div>
                              <h4 className={cn("font-bold text-xs mb-1", isSelected ? "text-[#2563EB]" : "text-[#0F172A]")}>{exp.name}</h4>
                              <p className="text-[10px] text-[#64748B] line-clamp-2 leading-relaxed">{exp.description}</p>
                            </button>
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
                      <button className="w-full text-xs font-bold text-[#2563EB] hover:text-[#2563EB]/80 flex items-center justify-between p-2 hover:bg-[#2563EB]/5 rounded-lg transition-colors">
                        {activeInsight.action} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
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
