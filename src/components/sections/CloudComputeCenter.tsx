import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Activity, Bot, Zap, CheckCircle2, Cloud, ShieldCheck, Handshake, Code2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type InstanceId = 'identity-core-vm' | 'tech-arsenal-vm' | 'deployment-zone-vm' | 'ai-lab-vm' | 'handshake-gateway-vm';
type TaskId = 'audit' | 'performance' | 'summary' | 'trace';

interface VMInstance {
  id: InstanceId;
  name: string;
  type: string;
  status: 'Running' | 'Active' | 'Open' | 'Starting';
  zone: string;
  stack: string;
  health: number;
  actionText: string;
}

interface AnalysisTask {
  id: TaskId;
  label: string;
  title: string;
  insight: string;
  result: string;
  confidence: number;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'Enabled' | 'Ready' | 'Running' | 'Completed';
  lastRun: string;
}

const vmInstances: VMInstance[] = [
  { id: 'identity-core-vm', name: 'identity-core-vm', type: 'Profile Service', status: 'Running', zone: 'asia-southeast2-a', stack: 'Astro, TypeScript', health: 99.9, actionText: 'Inspect' },
  { id: 'tech-arsenal-vm', name: 'tech-arsenal-vm', type: 'Skill Analysis Node', status: 'Running', zone: 'asia-southeast2-b', stack: 'TypeScript, Cloud, AI', health: 98.7, actionText: 'Analyze' },
  { id: 'deployment-zone-vm', name: 'deployment-zone-vm', type: 'Project Cluster', status: 'Running', zone: 'asia-southeast2-c', stack: 'SolidStart, Remix', health: 97.4, actionText: 'Open' },
  { id: 'ai-lab-vm', name: 'ai-lab-vm', type: 'AI Rec Engine', status: 'Active', zone: 'global-edge-ai', stack: 'LLM Workflow', health: 99.1, actionText: 'Run' },
  { id: 'handshake-gateway-vm', name: 'handshake-gateway-vm', type: 'Contact Gateway', status: 'Open', zone: 'public-access', stack: 'Form Handler', health: 100, actionText: 'Connect' },
];

const analysisTasks: Record<TaskId, AnalysisTask> = {
  'audit': { id: 'audit', label: 'Security Audit', title: 'Security Audit Completed', insight: 'Scanning repository and deployment dependencies...', result: '0 vulnerabilities found. Portfolio architecture is fully sandboxed and secured using strict CSP and edge deployment.', confidence: 100 },
  'performance': { id: 'performance', label: 'Analyze Performance', title: 'Performance Metrics', insight: 'Simulating multi-region load and evaluating TTFB...', result: 'TTFB < 50ms. Reactivity powered by Astro Islands. Excellent Core Web Vitals score predicted.', confidence: 98 },
  'summary': { id: 'summary', label: 'Tech Summary', title: 'Technical Synthesis', insight: 'Synthesizing core competencies from active instances...', result: 'Rafael demonstrates heavy proficiency in TypeScript and cloud-native architecture, prioritizing type safety, scalability, and modular component design.', confidence: 95 },
  'trace': { id: 'trace', label: 'Trace Deployments', title: 'Deployment Health Trace', insight: 'Pinging all active service clusters...', result: 'All deployment clusters are healthy and responding. SolidStart and Astro instances are reporting optimal throughput.', confidence: 99 },
};

const initialAutomationRules: AutomationRule[] = [
  { id: 'sys-analyzer', name: 'System Diagnostic Pipeline', trigger: 'AI Task Executed', action: 'Initialize deep scanning', status: 'Enabled', lastRun: 'Waiting for trigger' },
  { id: 'health-mon', name: 'Project Health Monitor', trigger: 'Deployment instance opened', action: 'Show project stack & impact', status: 'Enabled', lastRun: 'Waiting for trigger' },
  { id: 'smart-gate', name: 'Smart Contact Gateway', trigger: 'Collaboration requested', action: 'Open handshake form', status: 'Enabled', lastRun: 'Waiting for trigger' },
];

export default function CloudComputeCenter() {
  const [selectedInstance, setSelectedInstance] = useState<InstanceId | null>(null);
  const [isInstanceLoading, setIsInstanceLoading] = useState(false);
  
  const [selectedTask, setSelectedTask] = useState<TaskId | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);

  const runAutomation = (id: string) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, status: 'Running' } : r));
    setTimeout(() => {
      setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, status: 'Completed', lastRun: 'Just now' } : r));
      setTimeout(() => {
        setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, status: 'Enabled' } : r));
      }, 3000);
    }, 1200);
  };

  const handleInstanceClick = (id: InstanceId) => {
    if (selectedInstance === id) return;
    setIsInstanceLoading(true);
    setSelectedInstance(id);
    
    if (id === 'deployment-zone-vm') runAutomation('health-mon');
    if (id === 'handshake-gateway-vm') runAutomation('smart-gate');

    setTimeout(() => {
      setIsInstanceLoading(false);
    }, 800);
  };

  const handleTaskClick = (id: TaskId) => {
    setAiAnalyzing(true);
    setSelectedTask(id);
    runAutomation('sys-analyzer');
    setTimeout(() => {
      setAiAnalyzing(false);
    }, 1500);
  };

  const renderInstanceDetails = () => {
    if (!selectedInstance) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
          <Server className="w-12 h-12 mb-3" />
          <p className="text-sm">Select an instance to view details</p>
        </div>
      );
    }

    const instance = vmInstances.find(i => i.id === selectedInstance);

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-text-main text-lg">{instance?.name}</h4>
            <p className="text-xs text-text-muted font-mono">{instance?.zone} • {instance?.status}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 text-sm text-text-muted">
          {selectedInstance === 'identity-core-vm' && (
            <div className="space-y-3">
              <p><strong className="text-slate-700">Service:</strong> Rafael Matthew Satrio Profile</p>
              <p><strong className="text-slate-700">Role:</strong> Cloud & AI Engineer + Software Developer</p>
              <p><strong className="text-slate-700">Focus:</strong> Intelligent Web Systems</p>
              <p><strong className="text-slate-700">Status:</strong> <span className="text-success font-medium">Available for Collaboration</span></p>
              <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-xs font-bold text-slate-400 uppercase">Suggested Next Step</span>
                <p className="text-primary mt-1 flex items-center gap-1 cursor-pointer hover:underline" onClick={() => handleInstanceClick('tech-arsenal-vm')}>
                  Analyze tech-arsenal-vm <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </div>
          )}
          {selectedInstance === 'tech-arsenal-vm' && (
            <div className="space-y-3">
              <p><strong className="text-slate-700">Node Status:</strong> Synchronized</p>
              <p><strong className="text-slate-700">Core Engine:</strong> TypeScript, JavaScript, Astro, React</p>
              <p><strong className="text-slate-700">Cloud Layer:</strong> Vercel, Supabase, Google Cloud</p>
              <p><strong className="text-slate-700">AI Layer:</strong> LLM Integration, Workflow Automation</p>
              <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-xs font-bold text-slate-400 uppercase">Suggested Next Step</span>
                <p className="text-primary mt-1 flex items-center gap-1 cursor-pointer hover:underline" onClick={() => handleInstanceClick('deployment-zone-vm')}>
                  Inspect deployment-zone-vm <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </div>
          )}
          {selectedInstance === 'deployment-zone-vm' && (
            <div className="space-y-3">
              <p className="mb-2 font-medium text-slate-700">Active Service Clusters:</p>
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-2 rounded border border-slate-100 bg-white">
                  <span className="font-medium text-text-main">DawnBase</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Healthy</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded border border-slate-100 bg-white">
                  <span className="font-medium text-text-main">Omuda</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Stable</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded border border-slate-100 bg-white">
                  <span className="font-medium text-text-main">AI Billiard Coach</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Beta</span>
                </li>
              </ul>
            </div>
          )}
          {selectedInstance === 'ai-lab-vm' && (
            <div className="space-y-3">
               <p><strong className="text-slate-700">Engine:</strong> Predictive Ops V2</p>
               <p><strong className="text-slate-700">Capability:</strong> System Analysis & Auditing</p>
               <p className="italic bg-accent/5 p-3 rounded-lg border border-accent/10 text-accent/80 text-xs">
                 "Standing by. Trigger an analysis task from the AI Ops panel to evaluate current instances."
               </p>
            </div>
          )}
          {selectedInstance === 'handshake-gateway-vm' && (
            <div className="space-y-4 text-center mt-4">
              <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-text-main font-medium">Gateway Secured & Open</p>
              <p className="text-xs text-text-muted">Port 443 listening for collaboration requests.</p>
              <button onClick={() => document.getElementById('start-handshake')?.scrollIntoView({ behavior: 'smooth' })} className="mt-2 px-6 py-2 bg-text-main text-white text-sm font-medium rounded-md hover:bg-black transition-colors w-full flex items-center justify-center gap-2">
                Connect via Secure Channel <Handshake className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="compute-engine" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
          <Cloud className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">CloudVerse Compute Engine</h2>
          <p className="text-slate-500 font-medium">AI-guided portfolio infrastructure running on interactive cloud instances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Summary & Automation */}
        <div className="xl:col-span-3 flex flex-col gap-6 order-2 xl:order-1">
          {/* System Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> System Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Instances</span>
                <span className="text-sm font-bold text-slate-800">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Global Health</span>
                <span className="text-sm font-bold text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> 99.8%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Active Zone</span>
                <span className="text-sm font-mono text-slate-800">asia-southeast2</span>
              </div>
            </div>
          </div>

          {/* Automation Rules */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Automation Rules
            </h3>
            <div className="space-y-4">
              {automationRules.map(rule => (
                <div key={rule.id} className="text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Code2 className="w-3 h-3 text-slate-400" /> {rule.name}
                    </span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-[4px] font-medium text-[10px] uppercase",
                      rule.status === 'Running' ? "bg-amber-100 text-amber-700 animate-pulse" :
                      rule.status === 'Completed' ? "bg-success/10 text-success" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {rule.status}
                    </span>
                  </div>
                  <div className="pl-4 border-l-2 border-slate-100 space-y-1 mt-1.5">
                    <p className="text-slate-500"><span className="text-slate-400">Trg:</span> {rule.trigger}</p>
                    <p className="text-slate-500"><span className="text-slate-400">Act:</span> {rule.action}</p>
                    <p className="text-slate-400 text-[10px] italic mt-1">{rule.lastRun}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: VM Instances Table */}
        <div className="xl:col-span-6 flex flex-col gap-6 order-1 xl:order-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" /> Portfolio VM Instances
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">Instance Name</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Zone</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Health</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vmInstances.map(vm => (
                    <tr 
                      key={vm.id} 
                      className={cn(
                        "transition-colors group",
                        selectedInstance === vm.id ? "bg-blue-50/50" : "hover:bg-slate-50"
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            vm.status === 'Running' || vm.status === 'Active' || vm.status === 'Open' ? "bg-success" : "bg-amber-400"
                          )} />
                          <span className="font-medium text-slate-700 font-mono text-xs">{vm.name}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 sm:hidden">{vm.zone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-mono hidden sm:table-cell">
                        {vm.zone}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          vm.status === 'Running' || vm.status === 'Active' ? "bg-success/10 text-success" : 
                          vm.status === 'Open' ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
                        )}>
                          {vm.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell">
                        {vm.health}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleInstanceClick(vm.id)}
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-md font-medium transition-all",
                            selectedInstance === vm.id 
                              ? "bg-primary text-white shadow-sm"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 group-hover:border-slate-300"
                          )}
                        >
                          {vm.actionText}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Instance Detail Panel inside the same column (bottom) */}
            <div className="mt-auto border-t border-slate-200 bg-slate-50/50 min-h-[320px] sm:min-h-[350px] p-6 relative overflow-hidden">
               <AnimatePresence mode="wait">
                 {isInstanceLoading ? (
                   <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 flex flex-col items-center justify-center text-primary"
                   >
                     <Activity className="w-6 h-6 animate-spin mb-2" />
                     <p className="text-xs font-mono">Fetching instance details...</p>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key={selectedInstance || 'empty'}
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -5 }}
                     className="h-full"
                   >
                     {renderInstanceDetails()}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Ops Assistant */}
        <div className="xl:col-span-3 flex flex-col gap-6 order-3 xl:order-3">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-[30px] pointer-events-none" />
             
             <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-100">
               <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-accent" /> AI Ops Assistant
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">System Analyzer & Predictive Ops.</p>
               </div>
               <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase tracking-wide">
                 Active
               </span>
             </div>

             <div className="space-y-2 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Execute Analysis Task</p>
                <div className="flex flex-col gap-2">
                  {(Object.keys(analysisTasks) as TaskId[]).map(task => (
                    <button
                      key={task}
                      onClick={() => handleTaskClick(task)}
                      className={cn(
                        "px-3 py-2 text-xs font-medium rounded-md border transition-all text-left flex items-center justify-between",
                        selectedTask === task 
                          ? "bg-accent/10 border-accent/30 text-accent"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {analysisTasks[task].label}
                      {selectedTask === task && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
             </div>

             <div className="flex-1 bg-slate-50 rounded-lg border border-slate-100 p-4 relative min-h-[220px]">
               <AnimatePresence mode="wait">
                 {aiAnalyzing ? (
                   <motion.div
                     key="analyzing"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 flex flex-col items-center justify-center text-accent"
                   >
                     <Activity className="w-6 h-6 animate-spin mb-3" />
                     <p className="text-xs font-mono font-medium">Running Diagnostics...</p>
                   </motion.div>
                 ) : selectedTask ? (
                   <motion.div
                     key="result"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="h-full flex flex-col"
                   >
                      <h4 className="text-sm font-bold text-slate-800 mb-2">{analysisTasks[selectedTask].title}</h4>
                      <p className="text-xs text-slate-500 mb-4 font-mono">
                        {analysisTasks[selectedTask].insight}
                      </p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">System Integrity</span>
                          <span className="text-[10px] font-bold text-success">{analysisTasks[selectedTask].confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${analysisTasks[selectedTask].confidence}%` }} 
                            transition={{ duration: 1, delay: 0.2 }}
                            className="bg-success h-1.5 rounded-full" 
                          />
                        </div>
                      </div>

                      <div className="flex-1 mt-2">
                        <div className="bg-white border border-slate-200 p-3 rounded text-xs text-slate-700 leading-relaxed shadow-sm">
                          {analysisTasks[selectedTask].result}
                        </div>
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="empty"
                     className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 text-center"
                   >
                     <Bot className="w-10 h-10 mb-2" />
                     <p className="text-xs">Waiting for analysis task...</p>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
