"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";

/* ================== DATA ================== */

const testimonials = [
  {
    text:
      "Roll Academy isn’t just training — it’s transformation. Every session sharpened not just my body but my focus and spirit.",
    imageSrc: avatar1.src,
    name: "Rohan Verma",
    role: "Intermediate Martial Artist",
  },
  {
    text:
      "Before Roll Academy, I never believed I could master balance and speed. Now I move with purpose and precision.",
    imageSrc: avatar2.src,
    name: "Aarav Patel",
    role: "Martial Arts Enthusiast",
  },
  {
    text:
      "The instructors push you to your limits, but also teach control, respect, and the art behind every strike.",
    imageSrc: avatar3.src,
    name: "Isha Menon",
    role: "Black Belt Trainee",
  },
  {
    text:
      "Every lesson feels like a step toward mastery. This dojo changed how I view discipline and consistency.",
    imageSrc: avatar4.src,
    name: "Karan Shah",
    role: "Kickboxing Learner",
  },
  {
    text:
      "Joining Roll Academy was the best decision I made this year. I found focus, power, and a community.",
    imageSrc: avatar5.src,
    name: "Neha Sharma",
    role: "MMA Beginner",
  },
  {
    text:
      "The way techniques are broken down is incredible. Even online, I feel guided and corrected.",
    imageSrc: avatar6.src,
    name: "Rajat Singh",
    role: "Remote Student",
  },
  {
    text:
      "Every movement has meaning. Roll Academy teaches you to understand martial arts deeply.",
    imageSrc: avatar7.src,
    name: "Tanvi Joshi",
    role: "Advanced Trainee",
  },
  {
    text:
      "I’ve trained in many gyms, but none match the discipline and expertise found here.",
    imageSrc: avatar8.src,
    name: "Dev Rathore",
    role: "Fitness Coach",
  },
  {
    text:
      "It’s not about fighting others — it’s about mastering yourself. Roll Academy showed me that.",
    imageSrc: avatar9.src,
    name: "Anjali Nair",
    role: "Self-Defense Practitioner",
  },
];

/* ================== HELPERS ================== */

const split = [
  testimonials.slice(0, 3),
  testimonials.slice(3, 6),
  testimonials.slice(6, 9),
];

/* ================== COLUMN ================== */

const TestimonialColumn = ({
  items,
  duration,
  delay,
}: {
  items: typeof testimonials;
  duration: number;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
      viewport={{ once: false, margin: "-120px" }}
      className="flex flex-col gap-4 md:gap-6"
    >
      <motion.div
        animate={{ y: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-4 md:gap-6 pb-4 md:pb-6"
      >
        {[...items, ...items].map((t, idx) => (
          <article
            key={`${t.name}-${idx}`}
            className="bg-white rounded-2xl border border-red-100 p-4 md:p-6 shadow-lg hover:shadow-2xl transition"
          >
            <p className="text-gray-700 italic leading-relaxed text-sm md:text-base">
              “{t.text}”
            </p>

            <div className="flex items-center gap-3 mt-4 md:mt-6">
              <Image
                src={t.imageSrc}
                alt={`${t.name} testimonial`}
                width={44}
                height={44}
                className="rounded-full border-2 border-red-600"
              />
              <div>
                <div className="font-semibold text-gray-900 text-sm md:text-base">
                  {t.name}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  {t.role}
                </div>
              </div>
            </div>
          </article>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ================== MAIN ================== */

export const Testimonials = () => {
  return (
    <motion.section
      aria-labelledby="testimonials-heading"
      className="relative bg-gradient-to-b from-white via-red-50 to-red-100 py-16 md:py-28 overflow-hidden"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      viewport={{ once: false }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.header
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: false }}
        >
          <p className="uppercase text-xs tracking-[0.35em] text-red-700 font-semibold">
            Athlete Stories
          </p>

          <h2
            id="testimonials-heading"
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight"
          >
            What Fighters Say About{" "}
            <span className="text-red-700">Roll Academy</span>
          </h2>

          <p className="mt-4 md:mt-5 text-sm md:text-lg text-gray-600">
            Real experiences from students who transformed their
            training through discipline, structure, and precision.
          </p>
        </motion.header>

        {/* Wall of Proof */}
        <div className="relative mt-10 md:mt-16 flex justify-center gap-4 md:gap-6 max-h-[760px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          <TestimonialColumn items={split[0]} duration={18} delay={0.1} />
          <div className="hidden md:block">
            <TestimonialColumn items={split[1]} duration={22} delay={0.25} />
          </div>
          <div className="hidden lg:block">
            <TestimonialColumn items={split[2]} duration={20} delay={0.4} />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
