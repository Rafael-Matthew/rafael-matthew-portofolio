import { motion } from 'motion/react';
import { Briefcase, Users, Calendar, GraduationCap, Code } from 'lucide-react';

type Experience = {
  id: string;
  type: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  sort_order: number;
};

interface ExperienceTimelineProps {
  initialExperiences: Experience[];
}

export default function ExperienceTimeline({ initialExperiences }: ExperienceTimelineProps) {
  const workExperiences = initialExperiences.filter(e => ['Work', 'College Project', 'Freelance'].includes(e.type));
  const orgExperiences = initialExperiences.filter(e => ['Organization', 'Activity'].includes(e.type));

  const getTypeColor = (type: string) => {
    return 'text-primary bg-primary/10 border-primary';
  };

  const getBorderColor = (type: string) => {
    switch(type) {
      case 'College Project': return 'bg-primary';
      case 'Freelance': return 'bg-secondary';
      case 'Organization': return 'bg-green-500';
      case 'Activity': return 'bg-orange-500';
      default: return 'bg-accent';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'College Project': return <GraduationCap size={20} />;
      case 'Freelance': return <Code size={20} />;
      case 'Organization': return <Users size={20} />;
      default: return <Briefcase size={20} />;
    }
  };

  const renderTimeline = (title: string, experiences: Experience[], icon: React.ReactNode) => (
    <div className="mb-24">
      <div className="flex items-center space-x-4 mb-16 group cursor-default">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-4 bg-surface rounded-2xl border border-slate-600 shadow-lg text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300"
        >
          {icon}
        </motion.div>
        <h2 className="text-3xl font-bold text-text-main group-hover:text-primary transition-colors">{title}</h2>
      </div>

      <div className="relative border-l-2 border-slate-600 pl-8 ml-4 md:ml-0 md:border-l-0 md:pl-0">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`mb-16 relative flex flex-col md:flex-row ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            } group`}
          >
            {/* Timeline Dot */}
            <div className={`absolute left-[-41px] md:left-1/2 md:-ml-[20px] top-0 w-10 h-10 rounded-full bg-background border-4 flex items-center justify-center z-10 ${getTypeColor(exp.type)} group-hover:scale-125 group-hover:shadow-[0_0_15px_currentColor] transition-all duration-300`}>
              {getIcon(exp.type)}
            </div>

            {/* Content Card */}
            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'}`}>
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-surface p-8 rounded-[2rem] border border-slate-400 shadow-sm hover:border-primary hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)] transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 relative z-10">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-text-main group-hover:text-primary transition-colors">{exp.role}</h3>
                    <h4 className="text-lg text-primary font-medium">{exp.organization}</h4>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getTypeColor(exp.type)} group-hover:scale-105 transition-transform`}>
                    {exp.type}
                  </span>
                </div>

                <div className="flex items-center text-text-muted text-sm mb-6 bg-background/50 inline-block px-4 py-2 rounded-full border border-slate-600/50 relative z-10">
                  <Calendar size={16} className="mr-2 inline" />
                  <span>{exp.period}</span>
                </div>

                <p className="text-text-muted leading-relaxed whitespace-pre-line relative z-10">
                  {exp.description}
                </p>
              </motion.div>
            </div>

            {/* Central Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-[-64px] w-0.5 bg-slate-600 -ml-[1px] z-0 group-hover:bg-primary/50 transition-colors duration-500"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-10">
      {workExperiences.length > 0 && renderTimeline('Work & Professional Experience', workExperiences, <Briefcase size={32} />)}
      {orgExperiences.length > 0 && renderTimeline('Organization & Activities', orgExperiences, <Users size={32} />)}
    </div>
  );
}
