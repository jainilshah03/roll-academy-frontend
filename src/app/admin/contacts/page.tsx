"use client";

import { useEffect, useState } from "react";

type Msg = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  fileUrl?: string | null;
  status?: string;
  createdAt?: string;
};

export default function AdminContactsPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  useEffect(() => {
    // in production fetch from /api/admin/contacts (auth protected)
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => setMsgs(data || []))
      .catch(() => {});
  }, []);

  // simple UI actions (local only)
  const markResolved = (i: number) => {
    const copy = [...msgs];
    copy[i].status = "resolved";
    setMsgs(copy);
  };

  return (
    <main className="min-h-screen p-8 bg-[#f7f8fc]">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin — Contact Messages</h1>
        <div className="space-y-3">
          {msgs.length === 0 && <div className="text-gray-500">No messages yet (or endpoint returns mock).</div>}
          {msgs.map((m, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow flex justify-between items-start">
              <div>
                <div className="font-semibold">{m.name} <span className="text-xs text-gray-500">({m.email})</span></div>
                <div className="text-sm text-gray-600 mt-1">{m.subject}</div>
                <div className="text-sm mt-2">{m.message}</div>
                {m.fileUrl && <a href={m.fileUrl} target="_blank" className="text-sm text-red-700 block mt-2">Attachment</a>}
                <div className="text-xs text-gray-400 mt-1">{m.createdAt}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => markResolved(idx)} className="px-3 py-1 rounded bg-green-100 text-green-700">Resolve</button>
                <button className="px-3 py-1 rounded border">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
