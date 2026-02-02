"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Video = {
  id: string;
  title: string;
  url?: string | null;
  angles?: Record<string, string> | null;
  visibility: "PUBLIC" | "PRIVATE";
  thumbnail?: string | null; 
};

type Instructor = {
  name: string;
  bio?: string | null;
  avatar?: string | null;
  videos?: Video[];
};

const GYM_ID = "cmjicg6ss00008zwx98ga6gf2";

export default function InstructorPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH INSTRUCTOR ================= */
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/instructors/${params.slug}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then(setInstructor)
      .catch(() => setInstructor(null));
  }, [params.slug, BACKEND_URL]);

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

  if (!instructor) {
    return <div style={{ padding: 60 }}>Loading Instructor...</div>;
  }

  const videos = instructor.videos ?? [];

  /* ================= RENDER ================= */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        {instructor.avatar && (
          <img
            src={`${BACKEND_URL}${instructor.avatar}`}
            style={styles.avatar}
          />
        )}

        <div>
          <h1 style={styles.name}>{instructor.name}</h1>
          {instructor.bio && <p style={styles.bio}>{instructor.bio}</p>}
        </div>
      </div>

      {/* VIDEOS */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Videos</h2>

        {videos.length === 0 && (
          <p style={styles.empty}>No videos uploaded yet.</p>
        )}

        <div style={styles.grid}>
          {videos.map((v) => {
            const locked = v.visibility === "PRIVATE" && !isSubscribed;

            const previewSrc =
              v.url ||
              (v.angles ? Object.values(v.angles)[0] : "");

            return (
              <div
                key={v.id}
                style={styles.card}
              onClick={() => {
                if (locked) {
                  router.push("/");
                  setTimeout(() => {
                    const el = document.getElementById("pricing");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 300);
                } else {
                  router.push(`/instructors/video/${v.id}`);
                }
              }}

              >
                <video
  muted
  preload="metadata"
  playsInline
  poster={v.thumbnail ?? undefined}
  style={styles.video}
  src={previewSrc}
/>





                {locked && (
                  <div style={styles.lockedOverlay}>
                    🔒 Premium
                  </div>
                )}

                <div style={styles.cardTitle}>{v.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "40px 60px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#f8fafc",
  },

  header: {
    display: "flex",
    gap: 24,
    alignItems: "center",
    marginBottom: 48,
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #1e293b",
  },

  name: {
    margin: 0,
    fontSize: 36,
    fontWeight: 700,
  },

  bio: {
    marginTop: 10,
    maxWidth: 640,
    color: "#cbd5f5",
    lineHeight: 1.6,
  },

  section: {},
  sectionTitle: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 24,
  },

  empty: {
    color: "#94a3b8",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 24,
  },

  card: {
    background: "#020617",
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid #1e293b",
  },

  video: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    background: "black",
  },

  angleBar: {
    display: "flex",
    gap: 8,
    padding: 8,
    borderTop: "1px solid #1e293b",
  },

  angleBtn: {
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 12,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #1e293b",
    cursor: "pointer",
  },

  angleBtnActive: {
    background: "#dc2626",
    borderColor: "#dc2626",
  },

  lockedWrapper: {
    height: 180,
    background: "#020617",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  lockIcon: { fontSize: 36 },

  lockText: {
    fontSize: 14,
    color: "#e5e7eb",
  },

  subscribeBtn: {
    marginTop: 8,
    padding: "8px 16px",
    borderRadius: 999,
    background: "linear-gradient(90deg,#0284c7,#0ea5e9)",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  cardTitle: {
    padding: "12px 14px",
    fontSize: 14,
    fontWeight: 500,
    color: "#e5e7eb",
  },
};
