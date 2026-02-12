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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const [videos, setVideos] = useState<ApiVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<ApiVideo | null>(null);
  const [activeAngle, setActiveAngle] = useState<string>("A");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLockModal, setShowLockModal] = useState(false);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    async function loadVideos() {
      const res = await fetch("/api/videos", { credentials: "include" });
      const data = await res.json();
      setVideos(Array.isArray(data) ? data : []);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    fetch(`/api/subscriptions/status?gymId=${GYM_ID}`, { credentials: "include" })
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
    setActiveAngle("A");
    videoRefs.current = {};
  }

  function switchAngle(angle: string) {
    if (!activeVideo?.angles || angle === activeAngle) return;

    const current = videoRefs.current[activeAngle];
    const next = videoRefs.current[angle];
    if (!current || !next) return;

    const time = current.currentTime;
    const wasPlaying = !current.paused;
    const rate = current.playbackRate;

    next.pause();
    next.currentTime = time;
    next.playbackRate = rate;

    setActiveAngle(angle);

    if (wasPlaying) next.play().catch(() => {});
    setTimeout(() => current.pause(), 0);
  }

  useEffect(() => {
    if (!activeVideo?.angles) return;
    const active = videoRefs.current[activeAngle];
    if (!active) return;

    let raf: number;
    const sync = () => {
      Object.entries(videoRefs.current).forEach(([k, v]) => {
        if (!v || k === activeAngle) return;
        if (Math.abs(v.currentTime - active.currentTime) > 0.08) {
          v.currentTime = active.currentTime;
        }
      });
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, [activeVideo, activeAngle]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!activeVideo?.angles) return;
      const key = e.key.toUpperCase();
      if (ANGLE_KEYS.includes(key as any) && activeVideo.angles[key]) {
        e.preventDefault();
        switchAngle(key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideo, activeAngle]);

  function goToPricing() {
    router.push("/#pricing");
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStartX.current || !activeVideo?.angles) return;

    const diff = e.changedTouches[0].clientX - touchStartX.current;
    const angles = Object.keys(activeVideo.angles);
    const index = angles.indexOf(activeAngle);

    if (diff < -60 && angles[index + 1]) switchAngle(angles[index + 1]);
    if (diff > 60 && angles[index - 1]) switchAngle(angles[index - 1]);

    touchStartX.current = null;
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {activeVideo && (
          <div className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div
              ref={containerRef}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="relative w-full aspect-video bg-black"
            >
              {activeVideo.angles &&
                Object.entries(activeVideo.angles).map(([angle, src]) => (
                  <video
                    key={angle}
                    ref={(el) => {
                      videoRefs.current[angle] = el;
                    }}
                    src={resolveVideoSrc(src)}
                    preload="auto"
                    playsInline
                    controls={angle === activeAngle}
                    className={`absolute inset-0 w-full h-full ${
                      angle === activeAngle ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
