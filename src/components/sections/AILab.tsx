import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Zap, FolderGit2 } from 'lucide-react';
import type { Project } from '@/data/projects';
import { cn } from '@/lib/utils';

interface TerminalOutput {
  id: string;
  type: 'command' | 'text' | 'project_list' | 'skills' | 'error';
  content: any;
}

export default function AILab({ projects }: { projects: Project[] }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalOutput[]>([
    {
      id: 'init-1',
      type: 'text',
      content: 'CloudVerse Interactive Terminal v1.0.0. Type "help" for a list of commands.'
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const skills = [
    "TypeScript", "JavaScript", "Python", "Go", "C#", "C++",
    "React", "Astro", "Next.js", "SolidStart",
    "Node.js", "Express", "Supabase", "PostgreSQL",
    "Docker", "Google Cloud", "AWS", "Vercel", "Git"
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const newHistory: TerminalOutput[] = [...history, { id: Date.now().toString() + '-cmd', type: 'command', content: cmd } as TerminalOutput];
    
    const args = cmd.toLowerCase().split(' ');
    const mainCommand = args[0];

    let response: TerminalOutput;

    switch (mainCommand) {
      case 'help':
        response = {
          id: Date.now().toString(),
          type: 'text',
          content: `Available commands:
  help      - Show this help message
  skills    - List technical skills and arsenal
  projects  - List projects (usage: projects [tech], e.g. projects react)
  contact   - Display contact information
  clear     - Clear terminal history`
        };
        break;
      case 'skills':
        response = {
          id: Date.now().toString(),
          type: 'skills',
          content: skills
        };
        break;
      case 'projects':
        const techFilter = args[1];
        let filtered = projects;
        if (techFilter) {
          filtered = projects.filter(p => 
            p.techStack.some(t => t.toLowerCase().includes(techFilter.toLowerCase())) ||
            p.name.toLowerCase().includes(techFilter.toLowerCase())
          );
        }
        if (filtered.length > 0) {
          response = {
            id: Date.now().toString(),
            type: 'project_list',
            content: filtered.slice(0, 5) // Show top 5
          };
        } else {
          response = {
            id: Date.now().toString(),
            type: 'error',
            content: `No projects found matching "${techFilter}".`
          };
        }
        break;
      case 'contact':
        response = {
          id: Date.now().toString(),
          type: 'text',
          content: `Contact Initialization:
Email:    rafael.matthew.s@gmail.com
LinkedIn: linkedin.com/in/rafael-matthew
GitHub:   github.com/Rafael-Matthew`
        };
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        response = {
          id: Date.now().toString(),
          type: 'error',
          content: `Command not found: ${mainCommand}. Type "help" for a list of commands.`
        };
    }

    setHistory([...newHistory, response as TerminalOutput]);
    setInput('');
  };

  return (
    <section id="ai-lab" className="py-20 px-4 max-w-4xl mx-auto w-full">
      <div className="flex flex-col items-center text-center gap-3 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-primary shadow-lg shadow-primary/20 border border-slate-700">
          <Terminal className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-text-main">Interactive Terminal</h2>
          <p className="text-text-muted mt-2 max-w-md mx-auto">
            Interact directly with my portfolio database using commands. Try typing <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded">help</span>.
          </p>
        </div>
      </div>

      <div className="glass-card bg-[#0D1117] border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
        {/* Terminal Header */}
        <div className="bg-[#161B22] border-b border-slate-800 p-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-slate-400 text-xs font-mono ml-2 flex items-center gap-2">
            <Zap className="w-3 h-3" /> cloudverse-sh ~ bash
          </span>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-sm space-y-4 no-scrollbar">
          {history.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-slate-300"
            >
              {item.type === 'command' && (
                <div className="flex gap-2 text-primary font-bold">
                  <span className="text-success">➜</span>
                  <span>~</span>
                  <span className="text-slate-300">{item.content}</span>
                </div>
              )}
              {item.type === 'text' && (
                <pre className="whitespace-pre-wrap text-slate-400 leading-relaxed mt-1">
                  {item.content}
                </pre>
              )}
              {item.type === 'error' && (
                <div className="text-red-400 mt-1 flex items-center gap-2">
                  <span>❌</span> {item.content}
                </div>
              )}
              {item.type === 'skills' && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(item.content as string[]).map((skill, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-400 text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {item.type === 'project_list' && (
                <div className="space-y-3 mt-2">
                  {(item.content as Project[]).map((proj, i) => (
                    <div key={i} className="border-l-2 border-primary/50 pl-4 py-1">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <FolderGit2 className="w-4 h-4 text-primary" /> {proj.name}
                      </div>
                      <p className="text-slate-400 text-xs mt-1">{proj.problem}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.techStack.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  <p className="text-slate-500 italic text-xs mt-2">... end of results ...</p>
                </div>
              )}
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input */}
        <div className="p-4 border-t border-slate-800 bg-[#0D1117]">
          <form onSubmit={handleCommand} className="flex items-center gap-2 font-mono text-sm">
            <span className="text-success font-bold">➜</span>
            <span className="text-primary font-bold">~</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-700 focus:ring-0"
              placeholder="Type a command..."
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
