import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { skills, type SkillCategory, type Skill } from '@/data/skills';
import { Code2, LayoutTemplate, Server, Database, Cloud, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TechArsenal() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('Languages');
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const categories: { id: SkillCategory; icon: React.ReactNode; color: string }[] = [
    { id: 'Languages', icon: <Code2 className="w-5 h-5" />, color: 'text-primary bg-primary/10 border-primary/20' },
    { id: 'Frontend', icon: <LayoutTemplate className="w-5 h-5" />, color: 'text-secondary bg-secondary/10 border-secondary/20' },
    { id: 'Backend', icon: <Server className="w-5 h-5" />, color: 'text-accent bg-accent/10 border-accent/20' },
    { id: 'Databases', icon: <Database className="w-5 h-5" />, color: 'text-success bg-success/10 border-success/20' },
    { id: 'Cloud & DevOps', icon: <Cloud className="w-5 h-5" />, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { id: 'Soft Skills', icon: <Users className="w-5 h-5" />, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  ];

  const filteredSkills = skills.filter(skill => skill.category === activeCategory);

  const getHoverClass = (cat: SkillCategory) => {
    switch (cat) {
      case 'Languages': return "hover:border-primary/50 hover:shadow-primary/10";
      case 'Frontend': return "hover:border-secondary/50 hover:shadow-secondary/10";
      case 'Backend': return "hover:border-accent/50 hover:shadow-accent/10";
      case 'Databases': return "hover:border-success/50 hover:shadow-success/10";
      case 'Cloud & DevOps': return "hover:border-blue-500/50 hover:shadow-blue-500/10";
      case 'Soft Skills': return "hover:border-purple-500/50 hover:shadow-purple-500/10";
      default: return "hover:border-slate-500/50 hover:shadow-slate-500/10";
    }
  };

  const getShadowClass = (cat: SkillCategory) => {
    switch (cat) {
      case 'Languages': return "shadow-primary/10";
      case 'Frontend': return "shadow-secondary/10";
      case 'Backend': return "shadow-accent/10";
      case 'Databases': return "shadow-success/10";
      case 'Cloud & DevOps': return "shadow-blue-500/10";
      case 'Soft Skills': return "shadow-purple-500/10";
      default: return "shadow-slate-500/10";
    }
  };

  return (
    <section id="tech-arsenal" className="py-20 px-4 w-full bg-section border-y border-slate-200/50">
      <div className="max-w-5xl mx-auto glass-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-text-main">Tech Arsenal</h2>
            <p className="text-text-muted">Technology Stack & Key Skills</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Category Selector (Left) */}
          <div className="lg:col-span-4 space-y-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  suppressHydrationWarning
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border-2",
                    isActive 
                      ? `bg-white/50 shadow-md border-white/20 ${getShadowClass(cat.id)}`
                      : "bg-transparent border-transparent hover:bg-white/30 text-text-muted hover:text-text-main"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", cat.color)}>
                    {cat.icon}
                  </div>
                  <span className={cn("font-medium", isActive ? "text-text-main" : "")}>{cat.id}</span>
                </button>
              );
            })}


          </div>

          {/* Skill Grid/Nodes (Right) */}
          <div className="lg:col-span-8">
            <div className="bg-white/20 border border-white/30 p-8 rounded-3xl min-h-[400px] relative overflow-hidden flex flex-wrap content-start gap-4">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[80px] -z-10" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-wrap gap-4 w-full"
                >
                  {filteredSkills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className={cn(
                        "px-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 cursor-pointer transition-all duration-300",
                        "hover:shadow-lg hover:-translate-y-1 hover:bg-slate-50",
                        getHoverClass(activeCategory)
                      )}
                    >
                      <span className="font-semibold text-text-main">{skill.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Info Panel for Hovered Skill */}
            <div className="mt-6 w-full min-h-[120px]">
              <AnimatePresence mode="wait">
                {hoveredSkill ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 glass border-l-4 border-l-primary rounded-xl w-full flex flex-col justify-center min-h-[120px]"
                  >
                    <h4 className="font-bold text-text-main mb-1">{hoveredSkill.name}</h4>
                    <p className="text-sm text-text-muted">{hoveredSkill.description}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 glass opacity-50 border-dashed border-2 rounded-xl w-full flex items-center justify-center min-h-[120px]"
                  >
                    <p className="text-sm text-text-muted text-center">Hover over a node to view details.</p>
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
