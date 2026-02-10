import Link from "next/link";

type Instructor = {
  id: string;
  name: string;
  slug: string;
  avatar?: string | null;
};

function resolveSrc(src?: string | null) {
  if (!src) return "";
  if (src.startsWith("http")) return src; // ✅ already absolute (R2)
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${src}`; // ✅ relative backend path
}

export default async function InstructorsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructors`,
    { cache: "no-store" }
  );

  const instructors: Instructor[] = await res.json();

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <div style={styles.header}>
        <h1 style={styles.title}>Meet Our Instructors</h1>
        <p style={styles.subtitle}>
          Learn directly from world-class coaches and professionals
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div style={styles.grid}>
        {instructors.map((i) => (
          <Link
            key={i.id}
            href={`/instructors/${i.slug}`}
            style={styles.card}
          >
            {/* AVATAR */}
            <div style={styles.avatarWrapper}>
              {i.avatar ? (
                <img
                  src={resolveSrc(i.avatar)}
                  alt={i.name}
                  style={styles.avatar}
                />
              ) : (
                <div style={styles.fallbackAvatar}>
                  {i.name.charAt(0)}
                </div>
              )}
            </div>

            {/* INFO */}
            <div style={styles.info}>
              <h3 style={styles.name}>{i.name}</h3>
              <span style={styles.viewProfile}>
                View channel →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "60px 40px",
    background: "radial-gradient(circle at top, #020617, #000)",
    color: "#f8fafc",
  },

  header: {
    maxWidth: 900,
    marginBottom: 48,
  },

  title: {
    fontSize: 42,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.02em",
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: "#94a3b8",
    maxWidth: 600,
    lineHeight: 1.6,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 28,
    marginTop: 40,
  },

  card: {
    textDecoration: "none",
    color: "inherit",
    background:
      "linear-gradient(180deg, rgba(30,41,59,0.7), rgba(2,6,23,0.9))",
    borderRadius: 18,
    padding: "28px 20px",
    border: "1px solid rgba(148,163,184,0.15)",
    backdropFilter: "blur(10px)",
    transition: "all 0.25s ease",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  },

  avatarWrapper: {
    width: 110,
    height: 110,
    margin: "0 auto",
    borderRadius: "50%",
    padding: 4,
    background:
      "linear-gradient(135deg, #38bdf8, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    background: "#020617",
  },

  fallbackAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 42,
    fontWeight: 700,
    color: "#38bdf8",
  },

  info: {
    marginTop: 18,
    textAlign: "center",
  },

  name: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
  },

  viewProfile: {
    display: "inline-block",
    marginTop: 8,
    fontSize: 13,
    color: "#38bdf8",
    opacity: 0.85,
  },
};
