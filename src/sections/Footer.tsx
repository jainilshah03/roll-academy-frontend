import logo from "@/assets/logosaas.png";
import SocialX from "@/assets/social-x.svg";
import SocialInsta from "@/assets/social-insta.svg";
import SocialLinkedin from "@/assets/social-linkedin.svg";
import SocialPin from "@/assets/social-pin.svg";
import SocialYoutube from "@/assets/social-youtube.svg";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container max-w-4xl mx-auto">
        {/* Logo and Description */}
        <div className='inline-flex relative before:content-[""] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute'>
          <Image src={logo} alt="MartialHub Logo" height={40} className="relative" />
        </div>
        <h2 className="text-white text-xl font-semibold mt-4">ROLL ACADEMY</h2>
        <p className="text-[#BCBCBC] mt-2 max-w-md mx-auto">
          Premium martial arts training platform. Master your skills with expert guidance.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center md:text-left px-4 md:px-0">
          <div>
            <h3 className="text-white font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link href="/training">Browse Videos</Link></li>
              <li><Link href="/instructors">Instructors</Link></li>
              <li><Link href="/#pricing">Pricing</Link></li>
              <li><Link href="/#contact">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Help Center</h3>
            <ul className="space-y-1">
              <li><Link href="/#contact">Contact Us</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-2">Newsletter</h3>
            <p className="text-[#BCBCBC] mb-4">
              Get weekly training tips and updates
            </p>
            <form className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md bg-gray-800 text-white w-full sm:w-auto focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-400 text-black font-semibold rounded-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-8">
          <SocialX />
          <SocialInsta />
          <SocialLinkedin />
          <SocialPin />
          <SocialYoutube />
        </div>

        {/* Copyright */}
        <p className="mt-6 text-[#808080]">
          © 2025 Roll Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
