"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import bgImage from "@/assets/photo.jpg";

export const CallToAction = () => {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Very subtle motion (UNCHANGED)
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const handleEnrollClick = () => {
    document.getElementById("pricing")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <motion.section
      ref={ref}
      aria-labelledby="cta-heading"
      className="relative overflow-hidden py-16 md:py-28"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: false }}
    >
      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: bgScale }}
      >
        <img
          src={bgImage.src}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-3xl"
      >
        <h2
          id="cta-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white"
        >
          Ready to Train Like a{" "}
          <span className="text-red-500">True Martial Artist?</span>
        </h2>

        <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed">
          Unlock elite training, expert instructors, and multi-angle fight
          analysis designed for serious improvement.
        </p>

        <div className="mt-6 md:mt-8">
          <button
            onClick={handleEnrollClick}
            className="px-7 py-3 md:px-8 md:py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base md:text-lg font-semibold shadow-lg transition"
          >
            Enroll Now
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
};
