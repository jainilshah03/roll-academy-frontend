"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSuccess(true);
      form.reset();
    } catch (err: any) {
      console.error("CONTACT FORM ERROR:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          name="name"
          required
          placeholder="Your full name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject (optional)
        </label>
        <input
          name="subject"
          placeholder="Regarding training / pricing / trial"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Write your message here..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800 transition disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

      {success && (
        <p className="text-green-600 text-sm">
          ✅ Your message has been sent. We’ll get back to you shortly.
        </p>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
