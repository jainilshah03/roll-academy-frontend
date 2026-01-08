"use client";
import ArrowRight from "@/assets/arrow-right.svg";
import starImage from "@/assets/star.png";
import springImage from "@/assets/spring.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const handleEnrollClick = () => {
    const section = document.getElementById("pricing");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip"
    >
      <div className="container">
        <div className="section-heading relative text-center">
          <h2 className="section-title text-4xl font-extrabold text-black">
            Join <span className="text-red-600">Roll Academy</span> Today
          </h2>
          <p className="section-des mt-5 text-lg text-gray-700 max-w-2xl mx-auto">
            Train like a warrior. Unlock premium martial arts lessons, track your growth, 
            and reach your full potential with world-class instructors guiding you.
          </p>

          {/* Floating animated elements */}
          <motion.img
            src={starImage.src}
            alt="star decoration"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{ translateY }}
          />
          <motion.img
            src={springImage.src}
            alt="spring decoration"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{ translateY }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-10 justify-center">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnrollClick}
            className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-red-800 transition"
          >
            Enroll Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-text gap-2 text-black hover:text-red-700 transition"
          >
          </motion.button>
        </div>
      </div>
    </section>
  );
};
