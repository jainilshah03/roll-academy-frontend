"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import acmeLogo from "@/assets/logo-acme.png";
import quantamLogo from "@/assets/logo-quantum.png";
import echoLogo from "@/assets/logo-echo.png";
import celestialLogo from "@/assets/logo-celestial.png";
import pulseLogo from "@/assets/logo-pulse.png";
import apexLogo from "@/assets/logo-apex.png";

const logos = [
  acmeLogo,
  quantamLogo,
  echoLogo,
  celestialLogo,
  pulseLogo,
  apexLogo,
];

export const LogoTicker = () => {
  return (
    <motion.section
      className="bg-white py-14 md:py-24 overflow-hidden"
      initial={{ opacity: 0, scale: 0.92, y: 80 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      viewport={{ once: false, margin: "-120px" }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: false }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Trusted Martial Arts Training Platform for Fighters & Coaches
          </h2>

          <p className="mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-gray-600">
            Built with professionals who demand precision, discipline, and
            measurable performance improvement.
          </p>
        </motion.div>

        {/* Logos */}
        <motion.div
          className="mt-10 md:mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.4 },
            },
          }}
        >
          {logos.map((logo, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.85 },
                visible: { opacity: 0.9, y: 0, scale: 1 },
              }}
              whileHover={{ scale: 1.08 }}
              className="flex items-center justify-center"
            >
              <Image
                src={logo}
                alt="Martial arts academy partner"
                className="h-8 sm:h-9 md:h-10 w-auto"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
