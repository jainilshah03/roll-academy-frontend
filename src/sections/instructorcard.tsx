"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InstructorCard({ instructor }: { instructor: any }) {
  return (
    <motion.div
      whileHover={{ translateY: -6 }}
      className="bg-white rounded-xl shadow p-4 flex gap-4 items-start"
    >
      <Link href={`/instructors/${instructor.id}`} className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {instructor.avatar ? (
            // Next Image expects static or remote URLs; adjust if using remote images
            <Image
              src={instructor.avatar}
              alt={instructor.name}
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
              {instructor.name?.charAt(0)}
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1">
        <Link href={`/instructors/${instructor.id}`} className="block">
          <h3 className="font-semibold text-lg">{instructor.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">{instructor.title ?? "Martial Arts Instructor"}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-gray-500">{instructor.videos?.length ?? 0} videos</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{instructor.location ?? "Indore"}</span>
        </div>
      </div>
    </motion.div>
  );
}
