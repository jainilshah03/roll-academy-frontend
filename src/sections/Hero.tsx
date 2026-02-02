"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import cogGif from "@/assets/cog.gif";

export const Hero = () => {
  const ref = useRef<HTMLElement | null>(null);
  const router = useRouter();

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background */}
      <motion.img
        src={cogGif.src}
        alt="Martial arts training"
        className="
          absolute inset-0 w-full h-full
          object-cover
          object-[center_70%]
          md:object-center
          brightness-75
        "
        initial={{ scale: 1.08, filter: "blur(6px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.4 }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl px-4 sm:px-6 text-center text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="mb-4 text-xs tracking-[0.3em] uppercase text-gray-300">
          Elite Martial Arts Training Platform
        </p>

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
          Train Smarter.
          <br />
          <span className="text-[#FF4040]">Fight Better.</span>
          <br />
          Win Every Round.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm sm:text-lg text-gray-200">
          Roll Academy helps fighters and coaches improve performance using
          structured training and multi-angle video analysis.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/training")}
            className="px-8 py-4 rounded-full font-semibold bg-[#FF4040] hover:bg-[#ff5c5c] w-full sm:w-auto"
          >
            Start Training
          </button>
        </div>
      </motion.div>
    </section>
  );
};
