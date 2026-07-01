import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';

const roles = [
  "Frontend Developer",
  "UI/UX Designer",
  "Full-Stack Developer",
];

export default function HeroSection() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Typing effect
  useEffect(() => {
    let timer: number;
    const currentRole = roles[currentRoleIndex];
    
    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        timer = setTimeout(() => {}, 500);
      } else {
        timer = setTimeout(() => {
          setDisplayText(currentRole.substring(0, displayText.length - 1));
        }, 50);
      }
    } else {
      if (displayText.length === currentRole.length) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      } else {
        timer = setTimeout(() => {
          setDisplayText(currentRole.substring(0, displayText.length + 1));
        }, 100);
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIndex]);

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full text-left"
          >
            <h2 className="text-xl md:text-2xl font-medium text-text-main mb-2">
              Hello, I Am
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-text-main">
              Rafael Matthew<br/>
              <span className="text-primary">Satrio</span>
            </h1>

            <div className="h-12 md:h-16 mb-6">
              <h3 className="text-2xl md:text-3xl font-medium text-text-muted">
                <span className="border-r-2 border-primary pr-2">{displayText}</span>
              </h3>
            </div>

            <p className="text-lg text-text-muted mb-10 max-w-xl leading-relaxed">
              Informatics Engineering Student & Full-Stack Developer passionate about website development, cloud technology, and building practical digital systems.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <a 
                href="/contact" 
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-bold transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 flex items-center justify-center space-x-2 group"
              >
                <span>Let's Talk</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert("CV Download link will be available soon."); }}
                className="group flex items-center space-x-2 text-text-main hover:text-primary transition-colors font-medium"
              >
                <Download size={18} className="text-primary group-hover:-translate-y-1 transition-transform" />
                <span className="underline underline-offset-4 decoration-slate-600 group-hover:decoration-primary">Curriculum Vitae</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column - Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full flex justify-center md:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Decorative Border Rings */}
              <div className="absolute inset-0 rounded-full border-[6px] border-primary scale-105 opacity-80 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-2 border-secondary scale-110 opacity-30"></div>
              
              {/* Profile Image Container */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface bg-secondary/20 flex items-center justify-center backdrop-blur-sm">
                {/* Fallback avatar if no image */}
                <div className="text-6xl font-bold text-primary opacity-50">RMS</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
