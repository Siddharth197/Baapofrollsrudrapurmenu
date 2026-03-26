import React from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark text-white p-4">
        <div className="max-w-md mx-auto flex justify-between items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="flex items-center justify-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="Baap of Rolls Logo" 
                className="h-10 w-10 object-contain rounded-full border-2 border-brand-light shadow-md" 
                onError={(e) => e.target.style.display='none'} 
              />
              <h1 className="text-2xl font-black tracking-widest text-brand-yellow drop-shadow-lg uppercase">
                BAAP <span className="text-white">OF ROLLS</span>
              </h1>
            </div>
            <p className="text-[11px] text-brand-light opacity-80 font-medium tracking-[0.2em] uppercase mt-1">
              Authentic & Delicious
            </p>
          </motion.div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <div className="relative pt-[72px] h-[280px] w-full bg-brand-black overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1 }}
          src="/hero_banner.png" 
          alt="Delicious Rolls" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-light via-transparent to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center px-4"
          >
            <h2 className="text-3xl font-black text-white drop-shadow-xl mb-2 leading-tight">
              Crave-Worthy Rolls
            </h2>
            <p className="text-brand-light font-medium text-sm drop-shadow-md">
              Hand-rolled with fresh ingredients and bold flavors.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
