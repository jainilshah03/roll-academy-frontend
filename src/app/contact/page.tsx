"use client";

import ContactForm from "./components/ContactForm";
import ContactCard from "@/components/contact/ContactCard";
import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc]">
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold text-red-700">Get in touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            Questions about classes, pricing, or a trial session? Reach out — we reply within 24 hours.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="tel:+911234567890" className="px-4 py-2 rounded-lg border inline-flex items-center gap-2">
              Call us
            </a>

            <a href="mailto:hello@rollacademy.shop" className="px-4 py-2 rounded-lg border inline-flex items-center gap-2">
              Email
            </a>

            <Link href="/#pricing" className="px-4 py-2 rounded-lg bg-red-700 text-white">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Contact form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
          <ContactForm />
        </div>

        {/* Right: Quick contact + map + team */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Office</h3>
            <p className="text-sm text-gray-600">Roll Academy — Indore HQ</p>
            <p className="text-sm text-gray-600">123 Karate Lane, Indore, MP</p>
            <p className="mt-2">
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-sm text-red-700">View on map</a>
            </p>
            <div className="mt-3">
              <strong className="text-sm text-gray-700">Mon — Fri</strong>
              <div className="text-sm text-gray-600">9:00 AM — 6:00 PM</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-2">Schedule a Trial</h3>
            <p className="text-sm text-gray-600 mb-3">Pick a slot for a free trial class</p>
            {/* Calendly / scheduling embed placeholder */}
            <a
              href="https://calendly.com/" 
              target="_blank"
              rel="noreferrer"
              className="inline-block px-3 py-2 bg-red-700 text-white rounded"
            >
              Schedule a trial
            </a>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold mb-3">Team</h3>
            <ContactCard name="Saurabh Bhatt" role="Head Coach" email="saurabh@rollacademy.shop" />
            <ContactCard name="Meera Singh" role="Taekwondo Instructor" email="meera@rollacademy.shop" />
          </div>
        </aside>
      </section>

      <section className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-3">Frequently asked</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <details className="p-3 border rounded">
              <summary className="font-medium cursor-pointer">What should I bring for the first class?</summary>
              <div className="mt-2">Comfortable workout clothes, water, and a towel. We provide protective gear if needed.</div>
            </details>
            <details className="p-3 border rounded">
              <summary className="font-medium cursor-pointer">Do you offer beginner-only sessions?</summary>
              <div className="mt-2">Yes — we have beginner batches every month.</div>
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
