"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { CallToAction } from "@/sections/CallToAction";
import { Footer } from "@/sections/Footer";
import { Hero } from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker";
import { Pricing } from "@/sections/Pricing";
import { ProductShowcase } from "@/sections/ProductShowcase";
import { Testimonials } from "@/sections/Testimonials";

/* ================= INNER CLIENT COMPONENT ================= */

function HomeContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollTarget = searchParams.get("scroll");

    if (scrollTarget === "pricing") {
      const el = document.getElementById("pricing");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  return (
    <div>
      <Hero />
      <LogoTicker />
      <ProductShowcase />

      {/* 🔽 PRICING TARGET */}
      <section id="pricing">
        <Pricing />
      </section>

      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}

/* ================= PAGE WRAPPER ================= */

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
