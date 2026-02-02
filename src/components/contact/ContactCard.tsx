import Image from "next/image";

export default function ContactCard({ name, role, email }:{ name: string; role?: string; email?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-md">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold">
        {name?.charAt(0)}
      </div>
      <div className="text-left">
        <div className="font-semibold">{name}</div>
        {role && <div className="text-sm text-gray-600">{role}</div>}
        {email && <a href={`mailto:${email}`} className="text-sm text-red-700 block mt-1">{email}</a>}
      </div>
    </div>
  );
}
