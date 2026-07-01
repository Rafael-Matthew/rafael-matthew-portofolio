import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { ChevronRight, Code, ExternalLink, Folder } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  role: string;
  period: string;
  description: string;
  features: string[];
  tech_stack: string[];
  image_url: string | null;
  github_url: string | null;
  live_demo_url: string | null;
};

interface ProjectListProps {
  initialProjects: Project[];
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.9, z: -100 }}
      animate={{ opacity: 1, scale: 1, z: 0 }}
      exit={{ opacity: 0, scale: 0.9, z: -100 }}
      transition={{ duration: 0.5 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col group perspective-[1000px] h-full"
    >
      {/* 3D floating effect inner wrapper */}
      <div 
        className="flex flex-col flex-grow w-full h-full bg-surface rounded-[2rem] border border-slate-400 shadow-sm group-hover:border-primary group-hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)] transition-all duration-300"
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden rounded-t-[calc(2rem-1px)] bg-slate-100 flex-shrink-0">
          {project.image_url ? (
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Folder size={48} />
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute top-4 left-4" style={{ transform: "translateZ(20px)" }}>
            <span className="px-3 py-1 bg-surface/90 backdrop-blur-md text-primary text-xs font-bold rounded-full border border-slate-300 shadow-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-grow rounded-b-[2rem]" style={{ transform: "translateZ(10px)" }}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-text-main">
            {project.title}
          </h3>
          
          <p className="text-text-muted text-sm line-clamp-3 mb-6 flex-grow">
            {project.description}
          </p>

          {/* Tech Stack Preview */}
          <div className="flex flex-wrap gap-2 mb-6" style={{ transform: "translateZ(15px)" }}>
            {project.tech_stack && project.tech_stack.slice(0, 3).map((tech: string, i: number) => (
              <span key={i} className="text-xs font-medium px-3 py-1.5 bg-background text-text-muted border border-slate-300 rounded-full">
                {tech}
              </span>
            ))}
            {project.tech_stack && project.tech_stack.length > 3 && (
              <span className="text-xs font-medium px-3 py-1.5 bg-background text-text-muted border border-slate-300 rounded-full">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-300">
            <div className="flex space-x-4">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors">
                  <Code size={20} />
                </a>
              )}
              {project.live_demo_url && (
                <a href={project.live_demo_url} target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors">
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
            <a 
              href={`/projects/${project.slug}`} 
              className="flex items-center space-x-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors group/link"
            >
              <span>View 3D</span>
              <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(initialProjects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? initialProjects 
    : initialProjects.filter(p => p.category === filter);

  return (
    <div className="py-10">
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
              filter === category 
                ? 'bg-primary text-background shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-slate-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 perspective-[2000px]">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-text-muted font-medium">
          No projects found for this category.
        </div>
      )}
    </div>
  );
}
