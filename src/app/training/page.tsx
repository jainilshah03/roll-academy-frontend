"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ApiVideo = {
  id: string;
  title: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
};

const GYM_ID = "cmjicg6ss00008zwx98ga6gf2";

export default function TrainingPage() {
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const [videos, setVideos] = useState<ApiVideo[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ApiVideo | null>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch videos via FRONTEND API (cookie-safe)
  useEffect(() => {
    fetch("/api/videos", { credentials: "include" })
      .then((r) => r.json())
      .then(setVideos)
      .catch(console.error);
  }, []);

  // ✅ Check subscription via FRONTEND API (THIS UNLOCKS VIDEOS)
  useEffect(() => {
    fetch(`/api/subscriptions/status?gymId=${GYM_ID}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setIsSubscribed(d.subscribed === true))
      .catch(() => setIsSubscribed(false))
      .finally(() => setLoading(false));
  }, []);

  function handleVideoClick(video: ApiVideo) {
    if (video.visibility === "PRIVATE" && !isSubscribed) {
      setShowLockModal(true);
      return;
    }
    setActiveVideo(video);
  }

  function goToPricing() {
    router.push("/#pricing");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading training…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-900">
          Training Library
        </h1>

        {/* 🎥 Active Video */}
        {activeVideo && (
          <div className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden">
            <video
              src={`${BACKEND_URL}${activeVideo.url}`}
              controls
              className="w-full max-h-[520px] bg-black"
            />
            <div className="p-4 border-t">
              <h2 className="text-lg font-semibold text-gray-800">
                {activeVideo.title}
              </h2>
            </div>
          </div>
        )}

        {/* 📚 Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((v) => {
            const locked = v.visibility === "PRIVATE" && !isSubscribed;

            return (
              <div
                key={v.id}
                onClick={() => handleVideoClick(v)}
                className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="relative h-44 rounded-t-2xl overflow-hidden">
                  <video
                    src={`${BACKEND_URL}${v.url}`}
                    muted
                    className={`w-full h-full object-cover ${
                      locked ? "blur-md" : ""
                    }`}
                  />

                  {locked && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLockModal(true);
                      }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold"
                    >
                      🔒 Premium
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 line-clamp-2">
                    {v.title}
                  </h4>
                  <p className="text-xs mt-1 text-gray-500">
                    {locked ? "Premium Content" : "Free"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔔 Lock Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-[90%] text-center">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              Premium Training
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to unlock exclusive professional training videos.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowLockModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={goToPricing}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
