import React, { useState } from 'react';
import { Send, CheckCircle2, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function StartHandshake() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', contact: '', purpose: 'Collaboration', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const text = `Hello Rafael Matthew! \n\nIdentity: ${formData.name}\nEmail: ${formData.email}\nContact (WA): ${formData.contact}\nPurpose: ${formData.purpose}\n\nMessage:\n${formData.message}`;
    const encodedText = encodeURIComponent(text);
    
    // 1. Buka WhatsApp di tab baru
    window.open(`https://wa.me/6289612378711?text=${encodedText}`, '_blank');
    
    // 2. Gunakan trik iframe tersembunyi agar aplikasi Email terbuka 
    // tanpa mengganggu/membatalkan navigasi WhatsApp
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `mailto:rafaelmatthew2305@gmail.com?subject=CloudVerse Handshake: ${formData.purpose}&body=${encodedText}`;
    document.body.appendChild(iframe);
    
    // Bersihkan iframe setelah beberapa saat
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section id="start-handshake" className="py-20 px-4 w-full pb-32">
      <div className="max-w-3xl mx-auto glass-card p-8 md:p-12">
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
          <PhoneCall className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold text-text-main mb-2">Start Handshake</h2>
        <p className="text-text-muted">Initiate a secure connection for collaboration or hiring.</p>
      </div>

      <div className="relative overflow-hidden">
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
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Purpose</label>
                    <select value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                      <option>Collaboration</option>
                      <option>Hiring / Recruitment</option>
                      <option>Project Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                    <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Contact (WA)</label>
                    <input required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} type="tel" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="+62 812 3456 7890" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                  <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" placeholder="Enter your message here..."></textarea>
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
      </div>
    </section>
  );
}
