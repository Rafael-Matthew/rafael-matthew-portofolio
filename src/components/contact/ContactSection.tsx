import { motion } from 'motion/react';
import { Mail, MapPin, Link } from 'lucide-react';
import ContactForm from './ContactForm';

export default function ContactSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto perspective-[1000px]">
      
      {/* Contact Info */}
      <div className="space-y-8 lg:col-span-1">
        <motion.div 
          initial={{ opacity: 0, x: -50, rotateY: 10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-surface rounded-2xl border border-slate-600 shadow-xl p-8 flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-colors group"
        >
          <div className="p-4 bg-background rounded-full text-primary border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
            <Mail size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-text-main">Email</h3>
            <a href="mailto:rafaelmatthew2305@gmail.com" className="text-text-muted hover:text-primary transition-colors font-medium">
              rafaelmatthew2305@gmail.com
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50, rotateY: 10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-surface rounded-2xl border border-slate-600 shadow-xl p-8 flex flex-col items-center text-center space-y-4 hover:border-secondary/50 transition-colors group"
        >
          <div className="p-4 bg-background rounded-full text-secondary border border-secondary/20 shadow-inner group-hover:scale-110 transition-transform">
            <MapPin size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-text-main">Location</h3>
            <p className="text-text-muted font-medium">
              Surabaya, Indonesia
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -50, rotateY: 10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-surface rounded-2xl border border-slate-600 shadow-xl p-8 flex flex-col items-center text-center space-y-4 hover:border-accent/50 transition-colors group"
        >
          <div className="p-4 bg-background rounded-full text-accent border border-accent/20 shadow-inner group-hover:scale-110 transition-transform">
            <Link size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-text-main">LinkedIn</h3>
            <a href="https://linkedin.com/in/r-matthew" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors font-medium">
              linkedin.com/in/r-matthew
            </a>
          </div>
        </motion.div>
      </div>

      {/* Contact Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50, rotateY: -10 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-2 bg-surface rounded-3xl border border-slate-600 shadow-2xl p-8 md:p-12"
      >
        <ContactForm />
      </motion.div>

    </div>
  );
}
