import { motion } from 'motion/react';
import { User, Code, GraduationCap, Coffee } from 'lucide-react';

export default function AboutSection() {
  const highlights = [
    { icon: <Code size={24} />, title: "Web Developer", desc: "Building responsive, modern web apps." },
    { icon: <GraduationCap size={24} />, title: "Informatics Student", desc: "Studying software engineering at ISTTS." },
    { icon: <User size={24} />, title: "Team Player", desc: "Adaptable in collaborative environments." },
    { icon: <Coffee size={24} />, title: "Cloud Tech", desc: "Passionate about cloud infrastructure." }
  ];

  return (
    <section id="about-section" className="py-32 relative bg-surface overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-text-main"
          >
            About <span className="text-primary">Me</span>
          </motion.h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-background/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-600 shadow-xl mb-16 text-center"
        >
          <div className="inline-block p-4 bg-primary/10 rounded-2xl border border-primary/20 mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-primary italic">
              "Turning complex problems into simple, beautiful, and intuitive designs."
            </h3>
          </div>
          
          <div className="space-y-6 text-lg text-text-muted leading-relaxed max-w-3xl mx-auto">
            <p>
              Hello! I'm <strong className="text-text-main font-medium">Rafael Matthew Satrio</strong>, an Informatics Engineering student at Institut Sains dan Teknologi Terpadu Surabaya (ISTTS).
            </p>
            <p>
              My journey in tech is driven by a strong passion for <strong className="text-primary font-medium">Website Development</strong> and <strong className="text-primary font-medium">Cloud Technology</strong>.
            </p>
            <p>
              Beyond coding, I'm an adaptable individual who thrives in team environments. Whether it's brainstorming new architecture or debugging late at night, I'm always eager to learn and grow my expertise in building scalable, user-centric applications.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background p-6 rounded-2xl border border-slate-600 shadow-lg flex flex-col items-center text-center group hover:border-primary/50 transition-colors"
            >
              <div className="p-4 rounded-full mb-4 bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-background">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-main">{item.title}</h3>
              <p className="text-sm text-text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
