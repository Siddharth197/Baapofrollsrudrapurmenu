import React from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <>
      {/* Hero Video/Banner */}
      <div className="relative w-full h-[260px] bg-brand-black overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero_banner.png"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          {/* Replace src below with an actual .mp4 video file when available */}
          {/* <source src="/hero_video.mp4" type="video/mp4" /> */}
        </video>
        {/* Gradient overlay — bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/30 via-transparent to-brand-black/80" />

        {/* Overlay text on the banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute bottom-6 left-0 right-0 px-5 text-center"
        >
          <h2 className="text-[28px] font-black text-white drop-shadow-xl leading-tight">
            Crave-Worthy Rolls
          </h2>
          <p className="text-brand-light/80 text-sm font-normal mt-1 drop-shadow-md">
            Hand-rolled with fresh ingredients and bold flavors.
          </p>
        </motion.div>
      </div>

      {/* Brand Strip — below the banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-black px-5 py-3.5 flex items-center justify-center gap-3"
      >
        <img
          src="/logo.jpg"
          alt="Baap of Rolls Logo"
          className="h-9 w-9 object-contain rounded-full border-2 border-brand-yellow shadow-md"
          onError={(e) => (e.target.style.display = 'none')}
        />
        <div className="text-center">
          <h1 className="text-xl font-black tracking-widest text-brand-yellow uppercase leading-none">
            BAAP <span className="text-white">OF ROLLS</span>
          </h1>
          <p className="text-[10px] text-white/60 font-medium tracking-[0.2em] uppercase mt-0.5">
            Authentic &amp; Delicious
          </p>
        </div>
      </motion.div>
    </>
  );
}
