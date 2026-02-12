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
  { name: "Instructors", href: "/instructors" },
  { name: "Contact", href: "/contact" },
];

type User = {
  name?: string;
  email?: string;
};

export const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {}
    };
    checkAuth();
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const userInitial = (user?.name || user?.email || "U")[0].toUpperCase();

  return (
    <>
      {/* ================= HEADER ================= */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`sticky top-0 z-50 transition-all ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        }`}
      >
        {/* ================= TOP BANNER ================= */}
        <div className="flex justify-center items-center py-2 px-3 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white text-xs sm:text-sm gap-3 text-center">
          <p className="hidden md:block uppercase tracking-wide text-white/80">
            Strength • Discipline • Honor
          </p>
          <Link href="/#pricing" className="inline-flex gap-2 items-center">
            <span className="font-semibold uppercase tracking-widest">
              Enroll now
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ================= MAIN NAV ================= */}
        <div className="container mx-auto px-4 sm:px-6 py-4 md:py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="Roll Academy Logo"
                width={42}
                height={42}
              />
              <span className="hidden sm:block text-lg font-bold text-red-700 uppercase">
                Roll Academy
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-11 h-11 flex items-center justify-center text-red-700 rounded-lg hover:bg-red-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>

            {/* ================= DESKTOP NAV ================= */}
            <nav className="hidden md:flex items-center gap-8 font-semibold uppercase tracking-wide text-gray-800">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative ${
                    isActive(item.href)
                      ? "text-red-700"
                      : "hover:text-red-600"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-red-600 transition-all ${
                      isActive(item.href) ? "w-full" : "w-0 hover:w-full"
                    }`}
                  />
                </Link>
              ))}

              {!user ? (
                <Link href="/auth/signin">
                  <button className="bg-red-700 text-white px-5 py-2 rounded-lg font-bold">
                    Sign In
                  </button>
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white font-bold"
                  >
                    {userInitial}
                  </button>

                  {/* Desktop dropdown */}
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-xl p-3 border z-50"
                      >
                        <p className="mb-2 font-semibold text-gray-800">
                          Hi, {user.name || "User"}
                        </p>
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t flex flex-col gap-4 py-5 px-6 rounded-b-2xl shadow-lg"
            >
              {user && (
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white font-bold flex items-center justify-center">
                    {userInitial}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">
                      {user.name || "User"}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="uppercase font-semibold text-gray-900 text-base py-2 border-b last:border-none"
                >
                  {link.name}
                </Link>
              ))}

              {!user ? (
                <Link href="/auth/signin">
                  <button className="mt-4 bg-red-700 text-white px-8 py-3 rounded-xl font-bold w-full shadow-md">
                    Sign In
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="mt-4 w-full text-left px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-gray-100 border"
                >
                  Logout
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ================= LOGOUT MODAL ================= */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl text-center shadow-xl w-[90%] max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <p className="text-lg font-semibold mb-4">
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
                  className="bg-red-700 text-white px-5 py-2 rounded-lg"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="bg-gray-200 px-5 py-2 rounded-lg"
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
