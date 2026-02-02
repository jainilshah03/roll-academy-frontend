"use client";

import logo from "@/assets/logosaas.png";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedin from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer
      className="bg-black text-[#BCBCBC] text-sm pt-10 md:pt-20 pb-8 md:pb-10"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        {/* ================= BRAND ================= */}
        <div className="text-center">
          <Image
            src={logo}
            alt="Roll Academy"
            height={36}
            className="mx-auto"
          />

          <h2 className="text-white text-lg font-semibold mt-3">
            Roll Academy
          </h2>

          <p className="text-[#BCBCBC] mt-2 max-w-md mx-auto text-xs sm:text-sm">
            Premium martial arts training platform built for fighters, coaches,
            and serious practitioners.
          </p>
        </div>

        {/* ================= LINKS (STACKED ON MOBILE) ================= */}
        <div className="mt-10 space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Browse Videos", href: "/training" },
                { label: "Instructors", href: "/instructors" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Support", href: "/#contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-white transition text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              Help Center
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Contact Us", href: "/#contact" },
                { label: "FAQ", href: "/#faq" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-white transition text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-3">
              Newsletter
            </h3>
            <p className="text-[#BCBCBC] mb-4 text-sm">
              Weekly training tips, insights, and academy updates.
            </p>

            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-400 text-black"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ================= SOCIALS ================= */}
        <div className="flex justify-center gap-6 mt-10">
          {[SocialX, SocialInsta, SocialLinkedin, SocialPin, SocialYoutube].map(
            (Icon, i) => (
              <Icon key={i} className="opacity-80 hover:opacity-100 transition" />
            )
          )}
        </div>

        {/* ================= COPYRIGHT ================= */}
        <p className="mt-6 text-center text-[#808080] text-xs">
          © {new Date().getFullYear()} Roll Academy. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};
