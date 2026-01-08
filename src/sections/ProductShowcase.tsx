"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-[#fff] via-[#fef2f2] to-[#f3f4f6] py-24 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Section Intro */}
        <div className="max-w-[640px] mx-auto text-center">
          <div className="flex justify-center">
            <div className="tag uppercase text-red-700 font-semibold tracking-wider">
              Precision • Power • Perseverance
            </div>
          </div>

          <h2 className="text-4xl md:text-[54px] md:leading-[60px] font-extrabold tracking-tight bg-gradient-to-b from-black to-[#b91c1c] text-transparent bg-clip-text mt-5">
            Experience the Spirit of Roll Academy
          </h2>

          <p className="mt-5 text-gray-700 text-lg leading-relaxed">
            This short demonstration showcases the philosophy behind Roll Academy — discipline,
            strength, and relentless focus. Every movement embodies precision and purpose, just
            like your own journey once you step into the dojo.
          </p>
        </div>

        {/* 🎥 Video Showcase */}
        <div className="relative mt-16 w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-red-200 aspect-video bg-black">
          <video
            src="/basic.mp4"
            controls
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* 📖 Description Below Video */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-12 text-center max-w-3xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-red-700 mb-4">
            The Focus of a Single Combat — A Glimpse into Mastery
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            This footage captures a focused one-on-one combat session — the purest reflection of
            Roll Academy’s core values. Every frame highlights precision, patience, and awareness.
            It’s not just about overpowering an opponent — it’s about mastering the mind and body
            in unison.
          </p>

          <p className="text-gray-600 text-base mt-4 leading-relaxed">
            Watch closely as each movement unfolds with rhythm and control — from balanced stance
            to perfectly timed defense. This moment of combat shows that true strength lies in
            focus, not force. The fighter adapts, anticipates, and transforms instinct into art.
          </p>

          <p className="text-gray-600 text-base mt-4 leading-relaxed">
            This is a glimpse into the kind of personal footage subscribers gain exclusive access
            to — raw, unedited, and authentic training moments that reveal the depth of martial
            artistry. Inside the Roll Academy subscription, every fight tells a story, and every
            move is a lesson in discipline.
          </p>
        </motion.div>

        {/* Quote / Message BELOW the description */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-10 text-center"
        >
          <h3 className="text-black text-2xl font-semibold tracking-wide">
            “Discipline Turns Power into Art”
          </h3>
        </motion.div>
      </div>
    </section>
  );
};
