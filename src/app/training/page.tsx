"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ApiVideo = {
  id: string;
  title: string;
  url?: string | null;
  angles?: Record<string, string> | null;
  visibility: "PUBLIC" | "PRIVATE";
};

const GYM_ID = "cmjicg6ss00008zwx98ga6gf2";
const ANGLE_KEYS = ["A", "B", "C", "D"] as const;

function resolveVideoSrc(src?: string | null) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${src}`;
}

export default function TrainingPage() {
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const [videos, setVideos] = useState<ApiVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<ApiVideo | null>(null);
  const [activeAngle, setActiveAngle] = useState<string>("A");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLockModal, setShowLockModal] = useState(false);
  const [isFs, setIsFs] = useState(false);

  /* ================= FULLSCREEN STABILITY ================= */
  useEffect(() => {
    function onFsChange() {
      const container = containerRef.current;
      setIsFs(!!container && document.fullscreenElement === container);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  /* ================= FETCH VIDEOS ================= */
  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/videos`, {
          credentials: "include",
        });
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      } catch {
        setVideos([]);
      }
    }
    loadVideos();
  }, [BACKEND_URL]);

  /* ================= SUBSCRIPTION ================= */
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/subscriptions/status?gymId=${GYM_ID}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setIsSubscribed(d.subscribed === true))
      .catch(() => setIsSubscribed(false))
      .finally(() => setLoading(false));
  }, [BACKEND_URL]);

  /* ================= VIDEO CLICK ================= */
  function handleVideoClick(video: ApiVideo) {
    if (video.visibility === "PRIVATE" && !isSubscribed) {
      setShowLockModal(true);
      return;
    }
    setActiveVideo(video);
    setActiveAngle("A");
    videoRefs.current = {};
  }

  /* ================= ANGLE SWITCH (FULLSCREEN SAFE) ================= */
  async function switchAngle(angle: string) {
    if (!activeVideo?.angles || angle === activeAngle) return;

    const current = videoRefs.current[activeAngle];
    const next = videoRefs.current[angle];
    if (!current || !next) return;

    const wasFs = document.fullscreenElement === containerRef.current;

    const time = current.currentTime;
    const wasPlaying = !current.paused;
    const rate = current.playbackRate;

    next.pause();
    next.currentTime = time;
    next.playbackRate = rate;

    setActiveAngle(angle);

    requestAnimationFrame(async () => {
      if (wasPlaying) await next.play().catch(() => {});
      current.pause();

      if (wasFs && document.fullscreenElement !== containerRef.current) {
        containerRef.current?.requestFullscreen().catch(() => {});
      }
    });
  }

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!activeVideo?.angles) return;

      const key = e.key.toUpperCase();
      const current = videoRefs.current[activeAngle];

      if (e.code === "Space") {
        e.preventDefault();
        current?.paused ? current.play().catch(() => {}) : current?.pause();
      }

      if (ANGLE_KEYS.includes(key as any)) {
        e.preventDefault();
        switchAngle(key);
      }

      if (key === "F") {
        e.preventDefault();
        if (!document.fullscreenElement) {
          containerRef.current?.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideo, activeAngle]);

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

        {activeVideo && (
          <div className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div ref={containerRef} className="relative w-full aspect-video bg-black">
              {Object.entries(activeVideo.angles || {}).map(([angle, src]) => (
                <video
                  key={angle}
                  ref={(el) => {
                    videoRefs.current[angle] = el;
                  }}
                  src={resolveVideoSrc(src)}
                  preload="auto"
                  playsInline
                  muted
                  controls={angle === activeAngle}
                  className={`absolute inset-0 w-full h-full ${
                    angle === activeAngle ? "z-10" : "z-0 invisible"
                  }`}
                />
              ))}
            </div>

            {activeVideo.angles && (
              <div className="flex justify-center gap-3 py-3 bg-gray-50 border-t">
                {Object.keys(activeVideo.angles).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => switchAngle(angle)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold ${
                      activeAngle === angle
                        ? "bg-red-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    Angle {angle}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= VIDEO GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((v) => {
            const locked = v.visibility === "PRIVATE" && !isSubscribed;
            const previewSrc = v.url || (v.angles ? Object.values(v.angles)[0] : "");

            return (
              <div
                key={v.id}
                onClick={() => handleVideoClick(v)}
                className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="relative h-44 rounded-t-2xl overflow-hidden">
                  <video
                    src={resolveVideoSrc(previewSrc)}
                    muted
                    preload="metadata"
                    playsInline
                    className={`w-full h-full object-cover ${
                      locked ? "blur-md" : ""
                    }`}
                  />
                  {locked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                      🔒 Premium
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 line-clamp-2">
                    {v.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= LOCK MODAL ================= */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-[90%] text-center">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              Premium Training
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to unlock professional training videos.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowLockModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push("/#pricing")}
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
