"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

/* ================= TYPES ================= */

type Video = {
  id: string;
  title: string;
  url?: string | null;
  angles?: Record<string, string> | null;
};

/* ================= HELPERS ================= */

function resolveVideoSrc(src?: string | null) {
  if (!src) return "";
  if (src.startsWith("http")) return src; // Cloudflare R2
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${src}`; // legacy
}

const ANGLE_KEYS = ["A", "B", "C", "D"] as const;

/* ================= COMPONENT ================= */

export default function InstructorVideoPage() {
  const { id } = useParams();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [video, setVideo] = useState<Video | null>(null);
  const [activeAngle, setActiveAngle] = useState("A");

  /* ================= FETCH VIDEO ================= */

  useEffect(() => {
    if (!id) return;

    fetch(`${BACKEND_URL}/api/videos/${id}`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Video not found");
        return r.json();
      })
      .then(setVideo)
      .catch(() => setVideo(null));
  }, [id, BACKEND_URL]);

  /* ================= KEYBOARD SHORTCUTS ================= */

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!video?.angles) return;

      const key = e.key.toUpperCase();

      // A / B / C / D
      if (ANGLE_KEYS.includes(key as any)) {
        e.preventDefault();
        switchAngle(key);
      }

      // F → fullscreen
      if (key === "F" && containerRef.current) {
        if (!document.fullscreenElement) {
          containerRef.current.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, activeAngle]);

  /* ================= ANGLE SWITCH (SMOOTH) ================= */

  function switchAngle(angle: string) {
    if (!video?.angles || !videoRef.current) return;

    const el = videoRef.current;
    const currentTime = el.currentTime;
    const wasPlaying = !el.paused;

    const wasFullscreen =
      document.fullscreenElement === containerRef.current;

    setActiveAngle(angle);

    el.src = resolveVideoSrc(video.angles[angle]);
    el.load();

    el.onloadedmetadata = async () => {
      el.currentTime = currentTime;

      if (wasPlaying) {
        await el.play().catch(() => {});
      }

      // ✅ keep fullscreen
      if (wasFullscreen && containerRef.current) {
        containerRef.current.requestFullscreen?.().catch(() => {});
      }
    };
  }

  /* ================= LOADING ================= */

  if (!video) {
    return <p style={{ padding: 40 }}>Loading video…</p>;
  }

  const currentSrc = video.angles
    ? resolveVideoSrc(video.angles[activeAngle])
    : resolveVideoSrc(video.url);

  /* ================= RENDER ================= */

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>{video.title}</h1>

      <div ref={containerRef} style={styles.videoCard}>
        <video
          ref={videoRef}
          src={currentSrc}
          controls
          preload="auto"
          playsInline
          style={styles.video}
        />
      </div>

      {video.angles && (
        <div style={styles.angleRow}>
          {Object.keys(video.angles).map((a) => (
            <button
              key={a}
              onClick={() => switchAngle(a)}
              style={{
                ...styles.angleBtn,
                ...(activeAngle === a ? styles.angleActive : {}),
              }}
            >
              Angle {a}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "24px",
    minHeight: "100vh",
    background: "#f8fafc",
  },
  title: {
    maxWidth: 1100,
    margin: "0 auto 16px",
    fontSize: 26,
    fontWeight: 700,
  },
  videoCard: {
    maxWidth: 1100,
    margin: "0 auto",
    background: "black",
    borderRadius: 16,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    maxHeight: "70vh",
    background: "black",
  },
  angleRow: {
    maxWidth: 1100,
    margin: "16px auto 0",
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  angleBtn: {
    padding: "8px 18px",
    borderRadius: 999,
    border: "1px solid #cbd5e1",
    background: "white",
    cursor: "pointer",
  },
  angleActive: {
    background: "#dc2626",
    borderColor: "#dc2626",
    color: "white",
  },
};
