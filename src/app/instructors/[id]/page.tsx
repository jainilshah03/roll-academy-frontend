"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function InstructorPage({
  params,
}: {
  params: { id: string };
}) {
  const [instructor, setInstructor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInstructor() {
      try {
        const res = await fetch(`/api/instructors/${params.id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load instructor");

        const data = await res.json();
        setInstructor(data);
      } catch (err) {
        console.error(err);
        setError("Instructor not found");
      } finally {
        setLoading(false);
      }
    }

    loadInstructor();
  }, [params.id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!instructor) return null;

  return (
    <main className="container mx-auto px-6 py-10">
      {/* Instructor header */}
      <div className="flex gap-6 items-center mb-10">
        <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100">
          {instructor.avatar ? (
            <Image
              src={instructor.avatar}
              alt={instructor.user.name ?? "Instructor"}
              width={112}
              height={112}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
              {(instructor.user.name ?? instructor.user.email)[0]}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            {instructor.user.name ?? instructor.user.email}
          </h1>
          {instructor.title && (
            <p className="text-gray-600 mt-1">{instructor.title}</p>
          )}
          {instructor.bio && (
            <p className="text-gray-700 mt-2 max-w-xl">{instructor.bio}</p>
          )}
        </div>
      </div>

      {/* Videos */}
      <h2 className="text-xl font-semibold mb-4">
        Videos by this instructor
      </h2>

      {instructor.videos.length === 0 && (
        <p className="text-gray-500">No videos assigned yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructor.videos.map((v: any) => (
          <div
            key={v.id}
            className="bg-white rounded-xl shadow p-3"
          >
            <video
              src={v.url}
              controls
              className="w-full rounded-lg mb-2"
            />
            <h4 className="font-semibold">{v.title}</h4>
            {v.description && (
              <p className="text-sm text-gray-600 mt-1">
                {v.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
