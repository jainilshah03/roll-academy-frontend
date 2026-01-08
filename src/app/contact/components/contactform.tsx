"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("subject", subject);
      fd.append("message", message);
      if (file) fd.append("file", file);

      const res = await fetch("/api/contacts", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data?.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setFile(null);
      } else {
        alert("Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {sent && <div className="p-3 bg-green-50 text-green-800 rounded">Thanks — we’ll reply within 24 hours.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" className="px-4 py-2 border rounded" />
        <input required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Your email" type="email" className="px-4 py-2 border rounded" />
      </div>

      <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" className="px-4 py-2 border rounded w-full" />
      <textarea required value={message} onChange={(e)=>setMessage(e.target.value)} rows={5} placeholder="Message" className="px-4 py-2 border rounded w-full" />

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="file" onChange={(e)=> setFile(e.target.files?.[0] ?? null)} className="hidden" />
          <span className="px-3 py-2 border rounded text-sm">Attach file</span>
        </label>

        <button type="submit" disabled={loading} className="px-4 py-2 bg-red-700 text-white rounded">
          {loading ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
