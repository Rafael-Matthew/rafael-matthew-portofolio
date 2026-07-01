import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, User, Mail, MessageSquare, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-text-main ml-1">Your Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                <User size={18} />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-background border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-text-main placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-text-main ml-1">Your Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                <Mail size={18} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full bg-background border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-text-main placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-bold text-text-main ml-1">Subject</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
              <MessageSquare size={18} />
            </div>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="How can I help you?"
              className="w-full bg-background border border-slate-600 rounded-xl py-4 pl-12 pr-4 text-text-main placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-bold text-text-main ml-1">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Write your message here..."
            className="w-full bg-background border border-slate-600 rounded-xl py-4 px-5 text-text-main placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none shadow-inner"
          ></textarea>
        </div>

        <AnimatePresence>
          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-green-500/10 text-green-400 p-4 rounded-xl border border-green-500/20 flex items-start space-x-3"
            >
              <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Message sent successfully!</h4>
                <p className="text-sm mt-1 opacity-90">Thank you for reaching out. I'll get back to you as soon as possible.</p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold">Failed to send message</h4>
                <p className="text-sm mt-1 opacity-90">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center space-x-2 ${
            status === 'loading' 
              ? 'bg-primary/50 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-dark shadow-[0_0_15px_rgba(255,145,0,0.3)] hover:shadow-[0_0_25px_rgba(255,145,0,0.5)] hover:-translate-y-1'
          }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
