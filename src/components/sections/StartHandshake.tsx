import React, { useState } from 'react';
import { Send, CheckCircle2, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function StartHandshake() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section id="start-handshake" className="py-20 px-4 max-w-3xl mx-auto w-full pb-32">
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
          <PhoneCall className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-text-main mb-2">Start Handshake</h2>
        <p className="text-text-muted">Initiate a secure connection for collaboration or hiring.</p>
      </div>

      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center text-success mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-text-main mb-2">Handshake Successful</h3>
              <p className="text-text-muted mb-6">
                Your request has been securely transmitted to the CloudVerse system.<br/>
                Rafael will respond shortly.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Initiate another handshake
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Identity (Name)</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Return Address (Email)</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Protocol (Purpose)</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                    <option>Collaboration</option>
                    <option>Hiring / Recruitment</option>
                    <option>Project Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Payload (Message)</label>
                  <textarea required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Enter your message here..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
                    isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20"
                  )}
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Handshake Request'}
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
