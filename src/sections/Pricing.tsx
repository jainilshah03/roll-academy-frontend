"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckIcon from "@/assets/check.svg";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const GYM_ID = "cmjicg6ss00008zwx98ga6gf2";

const pricingTiers = [
  {
    title: "Basic Warrior",
    monthlyPrice: 0,
    buttonText: "Start Free",
    popular: false,
    inverse: false,
    features: [
      "Access to all public training videos",
      "Sample workout & technique clips",
      "Beginner-friendly training content",
      "View only open & community-shared videos",
      "Perfect for exploring Roll Academy",
    ],
  },
  {
    title: "Elite Sensei",
    monthlyPrice: 29,
    buttonText: "Unlock Full Access",
    popular: true,
    inverse: true,
    features: [
      "Unlimited access to all training videos",
      "Exclusive personal fighting footage",
      "Advanced combat & sparring breakdowns",
      "Private instructor-only content",
      "Early access to newly released videos",
      "Downloadable high-quality lessons",
    ],
  },
];

export const Pricing = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginRequired, setLoginRequired] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const res = await fetch(
          `/api/subscriptions/status?gymId=${GYM_ID}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setIsSubscribed(data.subscribed);
      } finally {
        setChecking(false);
      }
    }
    checkSubscription();
  }, []);

  async function handlePaidSubscribe() {
    try {
      setLoading(true);
      setLoginRequired(false);

      const res = await fetch(`/api/subscriptions/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ gymId: GYM_ID }),
      });

      if (res.status === 401) {
        setLoginRequired(true);
        return;
      }

      const data = await res.json();

      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Roll Academy",
        description: "Elite Sensei Membership",
        order_id: data.orderId,
        handler: async function () {
          router.push("/training");
        },
        theme: { color: "#991B1B" },
      });

      rzp.open();
    } finally {
      setLoading(false);
    }
  }

  if (checking) return null;

  /* ================= SUBSCRIBED ================= */
  if (isSubscribed) {
    return (
      <motion.section className="py-20 md:py-32 bg-white text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-black">
          🔓 You’re an <span className="text-red-700">Elite Sensei Member</span>
        </h2>
        <p className="mt-3 text-sm md:text-lg text-gray-600 max-w-xl mx-auto">
          Your membership is active. You have full access to all training
          sessions, exclusive fight footage, and instructor-only content.
        </p>
      </motion.section>
    );
  }

  /* ================= PRICING ================= */
  return (
    <motion.section
      id="pricing"
      className="py-16 md:py-32 bg-gradient-to-b from-white via-red-50 to-red-100"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-[56px] font-extrabold leading-tight">
            Train with <span className="text-red-700">Roll Academy</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm md:text-lg text-gray-600">
            Start free. Upgrade when you’re ready to train without limits.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center mt-10 md:mt-20">
          {pricingTiers.map(
            ({ title, monthlyPrice, buttonText, popular, features, inverse }) => (
              <motion.div
                key={title}
                whileHover={{ y: -10 }}
                className={twMerge(
                  "p-5 md:p-12 rounded-3xl max-w-sm w-full text-center shadow-xl relative",
                  inverse
                    ? "bg-gradient-to-b from-black to-red-900 text-white"
                    : "bg-white"
                )}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-lg md:text-2xl font-bold">
                  {title}
                </h3>

                <div className="text-3xl md:text-6xl font-extrabold mt-4 md:mt-6">
                  ${monthlyPrice}
                </div>

                <p className="mt-1 text-[10px] md:text-sm opacity-80">
                  per month
                </p>

                <button
                  disabled={loading}
                  onClick={
                    inverse
                      ? handlePaidSubscribe
                      : () => router.push("/auth/signin")
                  }
                  className={`mt-6 md:mt-8 w-full h-11 md:h-12 rounded-xl font-semibold text-sm md:text-lg ${
                    inverse
                      ? "bg-white text-black"
                      : "bg-red-700 text-white"
                  }`}
                >
                  {loading ? "Processing..." : buttonText}
                </button>

                <ul className="mt-6 md:mt-8 text-left space-y-2 md:space-y-3">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2 text-xs md:text-sm">
                      <CheckIcon className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.section>
  );
};
