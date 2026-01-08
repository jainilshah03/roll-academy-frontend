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
      "Access to 20+ open training clips",
      "Beginner-level tutorials",
      "Community group access",
      "Monthly dojo insights",
    ],
  },
  {
    title: "Elite Sensei",
    monthlyPrice: 29,
    buttonText: "Unlock Full Access",
    popular: true,
    inverse: true,
    features: [
      "Unlimited access to all exclusive videos",
      "Personal instructor footage",
      "Advanced combat breakdowns",
      "Private Q&A sessions",
      "Early access to new clips",
      "Downloadable HD lessons",
    ],
  },
];

export const Pricing = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginRequired, setLoginRequired] = useState(false);

  // 🔍 Check subscription status
  useEffect(() => {
    async function checkSubscription() {
      try {
        const res = await fetch(
          `/api/subscriptions/status?gymId=${GYM_ID}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setIsSubscribed(data.subscribed);
      } catch (err) {
        console.error("Failed to check subscription");
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

      // 🔐 Not logged in
      if (res.status === 401) {
        setLoginRequired(true);
        return;
      }

      if (!res.ok) {
        alert("Failed to create order");
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

        handler: async function (response: any) {
          const verifyRes = await fetch(
            `/api/subscriptions/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          if (!verifyRes.ok) {
            alert("Payment verification failed");
            return;
          }

          // ✅ PAYMENT DONE → GO TO TRAINING
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

  // ✅ Already subscribed
  if (isSubscribed) {
    return (
      <section className="py-24 bg-white text-center">
        <h2 className="text-4xl font-bold text-green-600">
          ✅ You are on Premium Version
        </h2>
        <p className="mt-4 text-gray-600">
          Enjoy full access to all training videos.
        </p>
      </section>
    );
  }

  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-b from-white via-red-50 to-red-100"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-[52px] font-extrabold">
            Become Part of <span className="text-red-700">Roll Academy</span>
          </h2>
        </div>

        <div className="flex flex-col gap-8 items-center mt-14 lg:flex-row lg:justify-center">
          {pricingTiers.map(
            ({ title, monthlyPrice, buttonText, popular, features, inverse }) => (
              <motion.div
                key={title}
                className={twMerge(
                  "p-10 rounded-3xl max-w-xs w-full text-center shadow-lg relative",
                  inverse
                    ? "bg-gradient-to-b from-black to-red-900 text-white"
                    : "bg-white"
                )}
              >
                {popular && (
                  <div className="absolute top-5 right-5 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-xl font-bold">{title}</h3>

                <div className="text-5xl font-extrabold mt-6">
                  ${monthlyPrice}
                </div>

                {inverse && loginRequired ? (
                  <div className="mt-8">
                    <p className="text-sm mb-3 text-red-200">
                      Please sign in to continue
                    </p>
                    <button
                      onClick={() => router.push("/auth/signin")}
                      className="w-full px-6 py-3 rounded-xl font-semibold bg-white text-black"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={inverse && loading}
                    onClick={inverse ? handlePaidSubscribe : undefined}
                    className={twMerge(
                      "mt-8 w-full px-6 py-3 rounded-xl font-semibold",
                      inverse
                        ? "bg-white text-black"
                        : "bg-red-700 text-white"
                    )}
                  >
                    {inverse && loading ? "Processing..." : buttonText}
                  </button>
                )}

                <ul className="mt-8 text-left">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <CheckIcon className="h-5 w-5 text-red-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
