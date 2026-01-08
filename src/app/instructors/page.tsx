"use client";

import { useEffect, useState } from "react";
import InstructorCard from "@/sections/InstructorCard";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(`${BACKEND}/api/instructors`)
      .then(r => r.json())
      .then(setInstructors);
  }, []);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Instructors</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {instructors.map((i) => (
          <InstructorCard
            key={i.id}
            instructor={{
              id: i.id,
              name: i.user.name ?? i.user.email,
              title: i.title,
              avatar: i.avatar,
              location: i.location,
              bio: i.bio,
              videos: i.videos,
            }}
          />
        ))}
      </div>
    </main>
  );
}
