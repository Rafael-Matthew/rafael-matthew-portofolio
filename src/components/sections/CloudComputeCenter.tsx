import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Activity, Code2, Star, GitFork, ExternalLink, RefreshCw, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  updated_at: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

export default function CloudComputeCenter() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.github.com/users/Rafael-Matthew/repos?sort=updated&per_page=6');
      if (!response.ok) throw new Error('Failed to fetch from GitHub API');
      const data = await response.json();
      setRepos(data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setTimeout(() => setLoading(false), 800); // slight delay for visual effect
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <section id="ai-ops" className="py-20 px-4 w-full bg-slate-50 border-y border-slate-200/50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text-main">Live GitHub Ops</h2>
              <p className="text-text-muted">Real-time Repository Monitoring</p>
            </div>
          </div>
          
          <button 
            onClick={fetchRepos}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Ping API
          </button>
        </div>

        <div className="glass-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/40">
          {/* Status Bar */}
          <div className="bg-slate-800 text-slate-300 p-3 px-6 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <CircleDot className={cn("w-3 h-3", error ? "text-red-400" : "text-success animate-pulse")} /> 
                API STATUS: {error ? "OFFLINE" : "HEALTHY"}
              </span>
              <span className="hidden sm:inline-block">ENDPOINT: api.github.com/users/Rafael-Matthew</span>
            </div>
            <span>UPDATED: {lastRefreshed.toLocaleTimeString()}</span>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-40 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
                  ))}
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <Activity className="w-12 h-12 text-red-400 mb-4" />
                  <p className="text-red-500 font-medium">{error}</p>
                  <p className="text-slate-500 text-sm mt-2">Could not establish connection to GitHub API.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {repos.map((repo, idx) => (
                    <motion.a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group block p-5 rounded-xl border border-slate-200 bg-white hover:border-primary/50 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 text-text-main font-bold">
                          <Code2 className="w-5 h-5 text-slate-700" />
                          <span className="truncate max-w-[160px]" title={repo.name}>{repo.name}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                      
                      <p className="text-sm text-text-muted line-clamp-2 h-10 mb-4">
                        {repo.description || "No description provided."}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-4">
                          {repo.language && (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                              {repo.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1 hover:text-yellow-600 transition-colors">
                            <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
                          </span>
                          <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <GitFork className="w-3.5 h-3.5" /> {repo.forks_count}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                        Last updated: {formatDate(repo.updated_at)}
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
