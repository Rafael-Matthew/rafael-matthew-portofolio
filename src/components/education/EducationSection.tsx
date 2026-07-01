import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Award, BookOpen, Calendar } from 'lucide-react';

type Education = {
  id: string;
  institution: string;
  major: string;
  period: string;
  gpa: string | null;
  relevant_courses: string[];
  achievements: string[];
  sort_order: number;
};

interface EducationSectionProps {
  educationData: Education[];
}

export default function EducationSection({ educationData }: EducationSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 perspective-[1500px]">
      <AnimatePresence>
        {educationData.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 50, rotateX: 15, z: -100 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
            style={{ transformStyle: "preserve-3d" }}
            className="bg-background rounded-3xl border border-slate-600 shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col relative group"
          >
            <div className="p-8 flex-grow bg-surface/50 backdrop-blur-sm group-hover:bg-surface/80 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-primary/10 text-primary rounded-2xl border border-primary/20 shadow-inner">
                    <GraduationCap size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-text-main group-hover:text-primary transition-colors">{edu.major}</h3>
                    <h4 className="text-lg text-primary font-medium">{edu.institution}</h4>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-8 mt-6">
                <div className="flex items-center space-x-2 text-text-muted text-sm bg-background/50 px-4 py-2 rounded-full border border-slate-600/50">
                  <Calendar size={16} className="text-primary" />
                  <span>{edu.period}</span>
                </div>
                {edu.gpa && (
                  <div className="flex items-center space-x-2 text-text-muted text-sm bg-background/50 px-4 py-2 rounded-full border border-slate-600/50">
                    <Award size={16} className="text-accent" />
                    <span>GPA: <strong className="text-text-main">{edu.gpa}</strong></span>
                  </div>
                )}
              </div>

              {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-4 text-text-main font-bold">
                    <BookOpen size={18} className="text-secondary" />
                    <span>Relevant Coursework</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.relevant_courses.map((course, i) => (
                      <span key={i} className="px-3 py-1.5 bg-background rounded-md text-xs font-medium text-text-muted border border-slate-600 shadow-sm hover:border-primary/30 hover:text-text-main transition-colors">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {edu.achievements && edu.achievements.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-600/50">
                  <div className="flex items-center space-x-2 mb-4 text-text-main font-bold">
                    <Award size={18} className="text-accent" />
                    <span>Achievements</span>
                  </div>
                  <ul className="space-y-4">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start space-x-3 text-text-muted">
                        <span className="text-accent mt-0.5 text-lg leading-none">★</span>
                        <span className="text-sm leading-relaxed">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
