import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Cpu, Cloud, ChevronRight, Terminal } from 'lucide-react';

const initSequence = [
  "Initializing Rafael Matthew Portfolio...",
  "Loading Cloud Environment...",
  "AI Systems Online...",
  "Software Modules Ready..."
];

export default function HeroCloudVerse({ profile }: { profile: any }) {
  const [initIndex, setInitIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initIndex < initSequence.length) {
      const timer = setTimeout(() => {
        setInitIndex(prev => prev + 1);
      }, 800); // 800ms per sequence
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsInitialized(true), 500);
    }
  }, [initIndex]);

  useEffect(() => {
    if (!isInitialized || !profile.roles.length) return;

    const role = profile.roles[currentRoleIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(prev => prev.slice(0, -1));
        if (currentText.length <= 1) {
          setIsDeleting(false);
          setCurrentRoleIndex((currentRoleIndex + 1) % profile.roles.length);
        }
      }, 50);
    } else {
      if (currentText === role) {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      } else {
        timer = setTimeout(() => {
          setCurrentText(role.slice(0, currentText.length + 1));
        }, 100);
      }
    }
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, isInitialized]);

  const scrollToAILab = () => {
    document.getElementById('cloud-intelligence')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20 pb-10 px-4">
      {/* Background Decorators */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text & CTA */}
        <div className="space-y-8 z-10">
          {/* Terminal / Init Screen */}
          <div className="glass-card p-4 rounded-xl font-mono text-sm min-h-[120px] flex flex-col justify-end overflow-hidden relative border-t-4 border-t-primary">
            <div className="absolute top-2 left-4 text-xs text-text-muted flex gap-2">
              <Terminal className="w-4 h-4" /> root@cloudverse:~
            </div>
            <div className="mt-6 space-y-1 text-text-muted">
              {initSequence.slice(0, initIndex).map((text, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-success">➜</span> {text}
                </motion.div>
              ))}
              {!isInitialized && (
                <motion.div 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-primary ml-2 align-middle"
                />
              )}
            </div>
          </div>

          <AnimatePresence>
            {isInitialized && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl md:text-2xl font-medium text-text-muted mb-2">Welcome to the system of</h2>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-main mb-6">
                    {profile.name}
                  </h1>
                  
                  {/* Typewriter Effect for Roles */}
                  <div className="flex items-center gap-2 text-xl md:text-2xl font-mono text-primary h-10 mt-4">
                    <span>&gt; </span>
                    <span className="font-bold border-b-2 border-primary/30 pb-0.5">{currentText}</span>
                    <motion.span 
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="w-3 h-8 bg-primary inline-block"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <div 
                    role="button"
                    onClick={scrollToAILab}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 cursor-pointer select-none"
                  >
                    Enter CloudVerse <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Floating Visuals */}
        <div className="relative h-[400px] lg:h-[500px] hidden md:block perspective-1000">
          <AnimatePresence>
            {isInitialized && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-full h-full relative flex items-center justify-center"
              >
                {/* Central Node */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute z-20 w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center border-4 border-white/20 backdrop-blur-xl"
                >
                  <Cloud className="w-16 h-16 text-white" />
                </motion.div>

                {/* Orbiting Elements */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute w-72 h-72 rounded-full border border-slate-200 border-dashed"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl glass flex items-center justify-center">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-xl glass flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-secondary" />
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute w-96 h-96 rounded-full border border-slate-200 border-dashed"
                >
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-xs font-bold text-accent">
                    AI
                  </div>
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-xs font-bold text-success">
                    DB
                  </div>
                </motion.div>
                
                {/* Connection lines would go here, simplified with orbits for DOM performance */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
