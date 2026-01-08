"use client";
import cogGif from "@/assets/cog.gif";
import { motion } from "framer-motion";
import { useRef } from "react";

export const Hero = () => {
  const heroRef = useRef(null);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center"
    >
      {/* 🎬 Background GIF */}
      <motion.img
        src={cogGif.src}
        alt="Martial Arts Motion Background"
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* 🔥 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80"></div>

      {/* 🌟 Foreground Content */}
      <motion.div
        className="relative z-10 text-white max-w-4xl px-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
      >
        <h1 className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
          Welcome to <span className="text-[#FF4040]"> Roll Academy </span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-200 mt-6 leading-relaxed max-w-2xl mx-auto">
          Experience the ultimate destination for martial arts excellence — where power meets discipline,  
          skill meets spirit, and every fighter becomes unstoppable.  
        </p>

        <p className="mt-8 text-sm md:text-base text-gray-400 tracking-wider uppercase">
          The World’s Most Immersive Martial Arts Platform
        </p>
      </motion.div>

      {/* ✨ Scroll Hint */}
      <motion.div
        className="absolute bottom-10 text-gray-300 text-sm tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        Enter the Dojo ↓
      </motion.div>
    </section>
  );
};
