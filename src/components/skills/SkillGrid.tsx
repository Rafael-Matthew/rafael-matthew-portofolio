import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Server, Database, Cloud, Terminal, Brain, Layers } from 'lucide-react';

type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  sort_order: number;
};

interface SkillGridProps {
  initialSkills: Skill[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Frontend': return Code2;
    case 'Backend': return Server;
    case 'Programming Language': return Terminal;
    case 'Database': return Database;
    case 'Cloud': return Cloud;
    case 'Tools': return Layers;
    case 'Soft Skills': return Brain;
    default: return Code2;
  }
};

export default function SkillGrid({ initialSkills }: SkillGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Ensure 'All' is first, then group existing categories
  const categories = ['All', ...Array.from(new Set(initialSkills.map(s => s.category)))];

  const filteredSkills = activeCategory === 'All'
    ? initialSkills
    : initialSkills.filter(s => s.category === activeCategory);

  return (
    <div className="py-10">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeCategory === category 
                  ? 'bg-primary text-background shadow-[0_0_15px_rgba(255,145,0,0.4)]' 
                  : 'bg-surface border border-slate-600 text-text-muted hover:text-text-main hover:bg-surface/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {activeCategory === 'All' ? (
          <div className="space-y-16">
            <div>
              <h2 className="text-2xl font-bold text-center text-text-main mb-8">Soft Skills</h2>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 perspective-[1000px]">
                <AnimatePresence mode="popLayout">
                  {initialSkills.filter(s => s.category === 'Soft Skills').map((skill) => {
                    const Icon = getCategoryIcon(skill.category);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.5, rotateX: -20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotateX: 20 }}
                        transition={{ duration: 0.4 }}
                        key={skill.id}
                        className="bg-surface p-6 rounded-2xl border border-slate-600 shadow-lg hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(255,145,0,0.1)] hover:-translate-y-2 transition-all flex flex-col items-center justify-center text-center group"
                      >
                        <div className="p-4 bg-background rounded-full mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-background transition-all shadow-inner">
                          <Icon size={28} />
                        </div>
                        <h3 className="font-bold text-text-main mb-2">{skill.name}</h3>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          {skill.category}
                        </span>
                        

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-center text-text-main mb-8">Hard Skills</h2>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 perspective-[1000px]">
                <AnimatePresence mode="popLayout">
                  {initialSkills.filter(s => s.category !== 'Soft Skills').map((skill) => {
                    const Icon = getCategoryIcon(skill.category);
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.5, rotateX: -20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotateX: 20 }}
                        transition={{ duration: 0.4 }}
                        key={skill.id}
                        className="bg-surface p-6 rounded-2xl border border-slate-600 shadow-lg hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(255,145,0,0.1)] hover:-translate-y-2 transition-all flex flex-col items-center justify-center text-center group"
                      >
                        <div className="p-4 bg-background rounded-full mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-background transition-all shadow-inner">
                          <Icon size={28} />
                        </div>
                        <h3 className="font-bold text-text-main mb-2">{skill.name}</h3>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          {skill.category}
                        </span>
                        

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 perspective-[1000px]">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => {
                const Icon = getCategoryIcon(skill.category);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.5, rotateX: -20 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotateX: 20 }}
                    transition={{ duration: 0.4 }}
                    key={skill.id}
                    className="bg-surface p-6 rounded-2xl border border-slate-600 shadow-lg hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(255,145,0,0.1)] hover:-translate-y-2 transition-all flex flex-col items-center justify-center text-center group"
                  >
                    <div className="p-4 bg-background rounded-full mb-4 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-background transition-all shadow-inner">
                      <Icon size={28} />
                    </div>
                    <h3 className="font-bold text-text-main mb-2">{skill.name}</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {skill.category}
                    </span>
                    

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
    </div>
  );
}
