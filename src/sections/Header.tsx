"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArrowRight from "@/assets/arrow-right.svg";
import Logo from "@/assets/logosaas.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Training", href: "/training" },
  { name: "Instructors", href: "/instructors" }, // <- updated
  { name: "Gallery", href: "/#gallery" },
  { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // ✅ Check login status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };
    checkAuth();
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/signout", { method: "POST", credentials: "include" });
      setUser(null);
      setShowMenu(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // support fragment links (e.g. /#gallery) by checking startsWith
    if (href.includes("#")) {
      const [base, hash] = href.split("#");
      if (base === "/" || base === "") {
        if (typeof window === "undefined") return false;
                return pathname === "/" && window.location.hash === `#${hash}`;

      }
      return pathname.startsWith(base);
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 backdrop-blur-lg z-20 border-b border-red-600 shadow-lg">
        {/* Top Banner */}
        <motion.div
          className="flex justify-center items-center py-3 bg-gradient-to-r from-red-700 via-black to-red-700 text-white text-sm gap-3"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/80 hidden md:block tracking-wide uppercase">
            Strength • Discipline • Honor
          </p>

          {/* SPA Link instead of plain anchor */}
                  <Link
          href="/#pricing"
          className="inline-flex gap-2 items-center cursor-pointer group"
          aria-label="Go to pricing"
        >
          <span className="font-semibold tracking-widest uppercase">Enroll now</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        </motion.div>

        {/* Main Navigation */}
        <div className="py-4">
          <div className="container mx-auto px-6">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <Link href="/" aria-label="Go to home" className="flex items-center gap-3 cursor-pointer">
                <Image src={Logo} alt="Roll Academy Martial Arts Logo" height={50} width={50} priority />
                <span className="text-2xl font-bold text-red-700 tracking-wider uppercase hidden sm:block">
                  Roll Academy
                </span>
              </Link>

              {/* Mobile Menu Icon */}
              <button
                className="h-6 w-6 md:hidden text-red-600 cursor-pointer"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                onClick={() => setMenuOpen((s) => !s)}
              >
                <MenuIcon />
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-8 text-black/80 items-center font-semibold uppercase tracking-wide">
                {NAV_LINKS.map((item, index) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <Link
                        href={item.href}
                        className={`inline-block px-1 py-1 focus:outline-none focus:ring-2 focus:ring-red-300 ${
                          active ? "text-red-700" : ""
                        }`}
                      >
                        <span className="relative">
                          {item.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 hover:w-full" />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Auth Section */}
                {!user ? (
                  <Link href="/auth/signin">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-700 text-white px-5 py-2 rounded-lg font-bold inline-flex items-center justify-center tracking-widest shadow-md hover:bg-red-800 transition"
                      aria-label="Sign in to Roll Academy"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                ) : (
                  <div className="relative">
                    {/* Avatar Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMenu((s) => !s)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold shadow-md hover:shadow-lg transition"
                      aria-haspopup="true"
                      aria-expanded={showMenu}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {showMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-xl border border-gray-100 z-50 p-3"
                        >
                          <p className="text-gray-800 font-semibold mb-2">Hi, {user.name} 👋</p>
                          <button
                            onClick={() => {
                              setShowMenu(false);
                              setShowLogoutConfirm(true);
                            }}
                            className="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-gray-100 rounded-lg"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </nav>
            </motion.div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-red-600 flex flex-col items-center py-4 gap-4"
            >
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-black/80 uppercase font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {!user && (
                <Link href="/auth/signin">
                  <button className="bg-red-700 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-red-800 transition">
                    Sign In
                  </button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Logout Confirmation Popup */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center"
            >
              <p className="text-lg font-semibold mb-5 text-gray-800">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={async () => {
                    await fetch("/api/signout", {
                      method: "POST",
                      credentials: "include",
                    });
                    setUser(null);
                    setShowLogoutConfirm(false);
                    window.location.href = "/";
                  }}
                  className="bg-red-700 text-white px-5 py-2 rounded-lg hover:bg-red-800 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
