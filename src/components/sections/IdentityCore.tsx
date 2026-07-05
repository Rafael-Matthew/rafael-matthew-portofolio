import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Code2, Heart } from 'lucide-react';

type Tab = 'professional' | 'technical' | 'personal';

export default function IdentityCore({ profile }: { profile: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('professional');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'professional', label: 'Professional', icon: <User className="w-4 h-4" /> },
    { id: 'technical', label: 'Technical', icon: <Code2 className="w-4 h-4" /> },
    { id: 'personal', label: 'Personal', icon: <Heart className="w-4 h-4" /> },
  ];

  // Variants untuk animasi scroll masuk dan keluar
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" as const } 
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1, 
      transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.3 } 
    },
    exit: { opacity: 0, x: 50, scale: 0.95, transition: { duration: 0.4 } }
  };

  return (
    <section id="identity-core" className="py-12 sm:py-20 md:py-32 px-4 md:px-8 w-full min-h-[80vh] flex items-center overflow-hidden">
      {/* Wadah Utama: Satu Glass Card Besar yang Menyatu */}
      <div className="max-w-7xl mx-auto w-full glass-card bg-white/60 backdrop-blur-2xl rounded-3xl lg:rounded-[3rem] shadow-2xl border border-white/60 p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden">
        
        {/* Ornamen Latar Opsional di dalam Card */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Kolom Kiri: Teks & Tombol (Diubah urutannya di mobile agar tampil setelah foto) */}
          <motion.div 
            className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1"
            variants={textContainerVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.3 }}
          >
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight mb-3 md:mb-4"
            >
              Hi, I'm <span className="text-primary">{profile.name}</span>
            </motion.h1>
            
            <motion.h2 
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-600 mb-6"
            >
              {profile.roles ? profile.roles[0] : 'Frontend Developer'}
            </motion.h2>
            
            {/* Navigasi Tab */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start w-full">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'bg-white/50 text-slate-600 hover:bg-white/80 hover:text-slate-800 border border-transparent hover:border-slate-200'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </motion.div>
            
            {/* Konten Tab */}
            <motion.div variants={itemVariants} className="mb-8 max-w-lg mx-auto lg:mx-0 relative">
              {/* Ghost element untuk menjaga tinggi wadah tetap stabil sesuai teks terpanjang secara responsif */}
              <div className="invisible pointer-events-none text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium" aria-hidden="true">
                <p>{profile.professionalSummary}</p>
              </div>

              {/* Konten aktual yang dianimasikan */}
              <div className="absolute top-0 left-0 w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium"
                  >
                    {activeTab === 'professional' && <p>{profile.professionalSummary}</p>}
                    {activeTab === 'technical' && <p>{profile.technicalSide}</p>}
                    {activeTab === 'personal' && <p>{profile.personalSide}</p>}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
            

          </motion.div>

          {/* Kolom Kanan: Gambar (Ditampilkan paling atas di versi mobile) */}
          <motion.div 
            className="relative flex justify-center lg:justify-end items-end h-full order-1 lg:order-2"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="relative w-full max-w-[250px] sm:max-w-sm lg:max-w-md xl:max-w-lg flex justify-center items-end">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-full h-auto object-contain drop-shadow-2xl"
                style={{ maxHeight: '600px' }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
