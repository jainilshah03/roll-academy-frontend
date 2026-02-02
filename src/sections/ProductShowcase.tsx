"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ProductShowcase = () => {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Very subtle unified movement
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-b from-[#0b0f1a] to-black py-28 overflow-hidden"
    >
      <motion.div style={{ y, opacity }}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* LEFT — TEXT */}
            <div>
              <span className="inline-block mb-5 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-red-600/20 text-red-400">
                Multi-Angle Training
              </span>

              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                See Every Fight.
                <br />
                <span className="text-[#FF4040]">From Every Angle.</span>
              </h2>

              <p className="mt-6 text-lg text-gray-300 leading-relaxed max-w-xl">
                Roll Academy lets fighters review training sessions using synchronized
                multi-angle footage. Analyze footwork, timing, defense, and transitions —
                all at once, all in real time.
              </p>

              <ul className="mt-8 space-y-4 text-gray-300">
                <li>• Simultaneous front, side, and corner views</li>
                <li>• Frame-by-frame fight breakdown</li>
                <li>• Coach-guided visual analysis</li>
                <li>• Learn faster through visual precision</li>
              </ul>
            </div>

            {/* RIGHT — MULTI ANGLE VISUAL */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-2xl">
                {[
                  { src: "basic1_fixed.mp4", label: "Angle A" },
                  { src: "basic2.mp4", label: "Angle B" },
                  { src: "basic3_fixed.mp4", label: "Angle C" },
                  { src: "basic4_fixed.mp4", label: "Angle D" },
                ].map((v) => (
                  <div
                    key={v.label}
                    className="relative aspect-video rounded-lg overflow-hidden bg-black"
                  >
                    <video
                      src={v.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover opacity-90"
                    />
                    <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-black/70 text-white">
                      {v.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs uppercase tracking-widest text-gray-400">
                Synced Multi-Angle Playback
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
