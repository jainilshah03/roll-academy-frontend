"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InstructorCard({
  instructor,
}: {
  instructor: any;
}) {
  return (
    <motion.article
  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start text-center sm:text-left"
>
  {/* Avatar */}
  <Link href={`/instructors/${instructor.id}`}>
    <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100">
      {instructor.avatar ? (
        <Image
          src={instructor.avatar}
          alt={instructor.name}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xl font-semibold">
          {instructor.name?.charAt(0)}
        </div>
      )}
    </div>
  </Link>

  {/* Content */}
  <div className="flex-1">
    <Link href={`/instructors/${instructor.id}`}>
      <h3 className="text-lg font-bold text-gray-900 hover:text-red-600">
        {instructor.name}
      </h3>
    </Link>

    <p className="text-sm text-gray-600 mt-1">
      {instructor.title ?? "Professional Martial Arts Instructor"}
    </p>

    <div className="mt-3 text-xs text-gray-500">
      {instructor.videos?.length ?? 0} videos •{" "}
      {instructor.location ?? "India"}
    </div>

    {/* Always visible on mobile */}
    <p className="mt-3 text-xs text-gray-500 sm:opacity-0 sm:group-hover:opacity-100 transition">
      View profile & training →
    </p>
  </div>
</motion.article>

  );
}
