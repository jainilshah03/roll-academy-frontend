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

  // Track stable fullscreen state (container-based)
  const [isFs, setIsFs] = useState(false);

  /* ================= SYNC FULLSCREEN (VIDEO ⛶ + F KEY) ================= */
  useEffect(() => {
    function onFsChange() {
      const container = containerRef.current;

      // If user fullscreened the VIDEO, mirror to container fullscreen
      if (document.fullscreenElement instanceof HTMLVideoElement && container) {
        container.requestFullscreen?.();
        setIsFs(true);
        return;
      }

      // Update state when container enters/exits fullscreen
      setIsFs(!!container && document.fullscreenElement === container);
    }

    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  /* ================= FETCH VIDEOS ================= */
  useEffect(() => {
    let mounted = true;

    async function loadVideos() {
      try {
        const res = await fetch("/api/videos", { credentials: "include" });
        const data = await res.json();
        if (mounted) setVideos(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setVideos([]);
      }
    }

    loadVideos();
    const t = setTimeout(loadVideos, 12000);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, []);

  /* ================= CHECK SUBSCRIPTION ================= */
  useEffect(() => {
    fetch(`/api/subscriptions/status?gymId=${GYM_ID}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setIsSubscribed(d.subscribed === true))
      .catch(() => setIsSubscribed(false))
      .finally(() => setLoading(false));
  }, []);

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

  /* ================= ANGLE SWITCH (ULTRA SMOOTH) ================= */
  function switchAngle(angle: string) {
    if (!activeVideo?.angles || angle === activeAngle) return;

    const vCurrent = videoRefs.current[activeAngle];
    const vNext = videoRefs.current[angle];
    if (!vCurrent || !vNext) return;

    const isVideoFs = document.fullscreenElement === vCurrent;

    const time = vCurrent.currentTime;
    const wasPlaying = !vCurrent.paused;
    const rate = vCurrent.playbackRate;

    // Pause the old video immediately to release the media decoder lock
    vCurrent.pause();

    // Set properties on the new video
    vNext.currentTime = time;
    vNext.playbackRate = rate;

    setActiveAngle(angle);

    if (isVideoFs) {
      // If the specific video tag was natively fullscreened, we MUST explicitly exit its
      // fullscreen state before hiding it via opacity-0, otherwise the browser will permanently 
      // lock its frame buffer black as an aborted fullscreen transition.
      document.exitFullscreen?.().then(() => {
        if (containerRef.current) {
          // Seamlessly upgrade to container fullscreen once the element is released
          containerRef.current.requestFullscreen?.().catch(() => { });
        }
      }).catch(() => { });
    }

    // Force Safari/iOS to draw the frame before trying to play it
    const playNext = () => {
      if (wasPlaying) {
        vNext.play().catch(() => {
          // If autoplay gets blocked, try to load the frame manually
          vNext.load();
          vNext.currentTime = time;
        });
      }
    };

    // Fix fullscreen compositor glitch and trigger play
    requestAnimationFrame(() => {
      vNext.dispatchEvent(new Event("resize"));
      // Delay play slightly so CSS opacity has time to apply and WebKit doesn't drop the frame
      setTimeout(playNext, 50);
    });
  }

  /* ================= KEEP ANGLES PERFECTLY SYNCED ================= */
  useEffect(() => {
    if (!activeVideo?.angles) return;

    const active = videoRefs.current[activeAngle];
    if (!active) return;

    let timer: any;

    const syncOthers = () => {
      Object.entries(videoRefs.current).forEach(([angle, vid]) => {
        if (!vid || angle === activeAngle) return;
        // Only sync if significant drift occurs (e.g. after seeking), preventing
        // CPU locks from continuously scrubbing paused background videos
        const drift = Math.abs(vid.currentTime - active.currentTime);
        if (drift > 0.3) vid.currentTime = active.currentTime;
      });
      timer = setTimeout(syncOthers, 1000);
    };

    timer = setTimeout(syncOthers, 1000);
    return () => clearTimeout(timer);
  }, [activeVideo, activeAngle]);

  /* ================= KEYBOARD SHORTCUTS ================= */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!activeVideo?.angles) return;

      const key = e.key.toUpperCase();
      const current = videoRefs.current[activeAngle];

      // Spacebar → play / pause
      if (e.code === "Space") {
        e.preventDefault();
        if (!current) return;
        current.paused ? current.play().catch(() => { }) : current.pause();
        return;
      }

      // A/B/C/D → switch angle
      if (ANGLE_KEYS.includes(key as any) && activeVideo.angles[key]) {
        e.preventDefault();
        switchAngle(key);
        return;
      }

      // F → toggle fullscreen (container)
      if (key === "F") {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
          container.requestFullscreen?.();
        } else if (isFs) {
          document.exitFullscreen?.();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideo, activeAngle, isFs]);

  function goToPricing() {
    router.push("/#pricing");
  }

  /* ================= TOUCH SWIPE LOGIC ================= */
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    if (!activeVideo?.angles) return;
    touchStartXRef.current = e.changedTouches[0].clientX;
    touchStartYRef.current = e.changedTouches[0].clientY;
    touchStartTimeRef.current = Date.now();
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      touchStartTimeRef.current === null ||
      !activeVideo?.angles
    ) {
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const diffX = touchStartXRef.current - touchEndX;
    const diffY = touchStartYRef.current - touchEndY;
    const timeDiff = touchEndTime - touchStartTimeRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchStartTimeRef.current = null;

    // Ignore if touch takes too long (e.g. holding down), or if they swiped vertically
    if (timeDiff > 500 || Math.abs(diffY) > 50) return;

    const SWIPE_THRESHOLD = 40;

    // Use ANGLE_KEYS to maintain logical A -> B -> C -> D order
    const availableAngles = ANGLE_KEYS.filter((k) => activeVideo.angles![k]);
    const currentIndex = availableAngles.indexOf(activeAngle as any);

    if (diffX > SWIPE_THRESHOLD && currentIndex < availableAngles.length - 1) {
      // Swiped left -> next angle
      switchAngle(availableAngles[currentIndex + 1]);
    } else if (diffX < -SWIPE_THRESHOLD && currentIndex > 0) {
      // Swiped right -> previous angle
      switchAngle(availableAngles[currentIndex - 1]);
    }
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

        {activeVideo && (
          <div className="mb-12 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div
              ref={containerRef}
              className="relative w-full aspect-video bg-black touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {activeVideo.angles ? (
                Object.entries(activeVideo.angles).map(([angle, src]) => (
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
                    className={`absolute inset-0 w-full h-full transition-opacity duration-150 ${angle === activeAngle
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                      }`}
                  />
                ))
              ) : (
                <video
                  src={resolveVideoSrc(activeVideo.url)}
                  controls
                  preload="metadata"
                  className="w-full h-full"
                />
              )}
            </div>

            {activeVideo.angles && (
              <div className="flex justify-center gap-3 py-3 bg-gray-50 border-t">
                {Object.keys(activeVideo.angles).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => switchAngle(angle)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition ${activeAngle === angle
                      ? "bg-red-600 text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    Angle {angle}
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 border-t">
              <h2 className="text-lg font-semibold text-gray-800">
                {activeVideo.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Keyboard: A / B / C / D • Fullscreen: F • Space: Play/Pause
              </p>
            </div>
          </div>
        )}

        {/* ================= VIDEO GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((v) => {
            const locked = v.visibility === "PRIVATE" && !isSubscribed;
            const previewSrc =
              v.url || (v.angles ? Object.values(v.angles)[0] : "");

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
                    className={`w-full h-full object-cover ${locked ? "blur-md" : ""
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
