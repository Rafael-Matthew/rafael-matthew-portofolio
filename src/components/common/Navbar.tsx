import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Skills', href: '/skills' },
  { name: 'Experience', href: '/experience' },
  { name: 'Education', href: '/education' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar({ currentPath = '/' }: { currentPath?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-surface/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] border-b border-slate-600/50 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-text-main tracking-tighter">
          Rafael<span className="text-primary">.dev</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-1">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href);
            return (
              <a
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-text-muted hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-text-main p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="md:hidden bg-surface border-t border-slate-600/50 shadow-lg">
              <div className="flex flex-col space-y-1 px-4 py-6">
                {navLinks.map((link) => {
                  const isActive = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href);
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-3 rounded-xl transition-all font-medium ${
                        isActive 
                          ? 'text-primary bg-primary/10' 
                          : 'text-text-muted hover:text-primary hover:bg-primary/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
