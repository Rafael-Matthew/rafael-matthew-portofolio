import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Cpu, Terminal, Layers, Code, Zap, PhoneCall } from 'lucide-react';

const navItems = [
  { id: 'cloud-intelligence', label: 'AI Lab', icon: <Zap className="w-4 h-4" /> },
  { id: 'identity-core', label: 'Identity Core', icon: <Terminal className="w-4 h-4" /> },
  { id: 'tech-arsenal', label: 'Tech Arsenal', icon: <Cpu className="w-4 h-4" /> },
  { id: 'deployment-zone', label: 'Deployment Zone', icon: <Layers className="w-4 h-4" /> },
  { id: 'timeline-pipeline', label: 'Timeline Pipeline', icon: <Code className="w-4 h-4" /> },
  { id: 'start-handshake', label: 'Start Handshake', icon: <PhoneCall className="w-4 h-4" /> },
];

export default function MissionNav() {
  const [activeId, setActiveId] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple intersection observer logic for nav highlighting
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let currentActive = 'hero';
      for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition) {
          currentActive = section.id;
        }
      }
      setActiveId(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-11/12 max-w-5xl",
      isScrolled ? "py-2" : "py-4"
    )}>
      <div className="glass px-2 md:px-4 py-2 md:py-3 rounded-full flex items-center justify-between overflow-x-auto no-scrollbar gap-4 md:gap-2">
        <div className="w-1 md:w-2 shrink-0"></div>
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer select-none",
                isActive 
                  ? "bg-blue-50 text-primary shadow-sm" 
                  : "text-text-muted hover:text-text-main hover:bg-slate-50"
              )}
            >
              {item.icon}
              <span className={cn("hidden md:block transition-all", isActive ? "font-semibold" : "")}>
                {item.label}
              </span>
            </div>
          );
        })}
        <div className="w-1 md:w-2 shrink-0"></div>
      </div>
    </nav>
  );
}
