"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
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

const testimonials = [
  {
    text: "Roll Academy isn’t just training — it’s transformation. Every session sharpened not just my body but my focus and spirit.",
    imageSrc: avatar1.src,
    name: "Rohan Verma",
    username: "Student – Intermediate Level",
  },
  {
    text: "Before Roll Academy, I never believed I could master my balance and speed. Now I move with purpose and precision.",
    imageSrc: avatar2.src,
    name: "Aarav Patel",
    username: "Martial Arts Enthusiast",
  },
  {
    text: "The instructors here push you to your limits — but also teach you control, respect, and the art behind every strike.",
    imageSrc: avatar3.src,
    name: "Isha Menon",
    username: "Black Belt Trainee",
  },
  {
    text: "Every lesson feels like a step toward mastery. The energy, the passion — this dojo changed how I view discipline.",
    imageSrc: avatar4.src,
    name: "Karan Shah",
    username: "Kickboxing Learner",
  },
  {
    text: "Joining Roll Academy was the best decision I made this year. I found focus, power, and a family that pushes me to improve.",
    imageSrc: avatar5.src,
    name: "Neha Sharma",
    username: "MMA Beginner",
  },
  {
    text: "The way they break down techniques is incredible. Even through online sessions, I feel completely guided and corrected.",
    imageSrc: avatar6.src,
    name: "Rajat Singh",
    username: "Remote Learner",
  },
  {
    text: "Every strike, every block, every movement — they all have meaning. Roll Academy makes you understand that deeply.",
    imageSrc: avatar7.src,
    name: "Tanvi Joshi",
    username: "Advanced Trainee",
  },
  {
    text: "I’ve trained in multiple gyms, but none match the dedication and expertise found here. True martial spirit lives at Roll Academy.",
    imageSrc: avatar8.src,
    name: "Dev Rathore",
    username: "Fitness Coach",
  },
  {
    text: "It’s not about fighting others — it’s about mastering yourself. Roll Academy helped me understand that fully.",
    imageSrc: avatar9.src,
    name: "Anjali Nair",
    username: "Self-Defense Practitioner",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = ({
  className,
  testimonials,
  duration,
}: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => (
  <div className={className}>
    <motion.div
      animate={{ translateY: "-50%" }}
      transition={{
        duration: duration || 15,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[
        ...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, imageSrc, name, username }) => (
              <div
                className="bg-white/90 border border-red-100 shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
                key={username}
              >
                <p className="text-gray-700 italic leading-relaxed">“{text}”</p>
                <div className="flex items-center gap-3 mt-5">
                  <Image
                    width={44}
                    height={44}
                    src={imageSrc}
                    alt={name}
                    className="h-11 w-11 rounded-full border-2 border-red-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{name}</div>
                    <div className="text-sm text-gray-500">{username}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        )),
      ]}
    </motion.div>
  </div>
);

export const Testimonials = () => {
  return (
    <section className="bg-gradient-to-b from-[#fff] via-[#fef2f2] to-[#fee2e2] py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="uppercase text-sm tracking-widest text-red-700 font-semibold">
            Voices of Strength
          </div>
          <h2 className="mt-4 text-4xl md:text-[52px] font-extrabold text-black tracking-tight">
            What Warriors Say About <span className="text-red-700">Roll Academy</span>
          </h2>
          <p className="mt-5 text-gray-600 text-lg leading-relaxed">
            Real stories of growth, power, and focus — from students who turned their training into
            transformation.
          </p>
        </div>

        {/* Testimonials Animation Grid */}
        <div className="flex justify-center gap-6 mt-14 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={18} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={16} />
        </div>
      </div>
    </section>
  );
};
