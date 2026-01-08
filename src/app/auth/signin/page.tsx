"use client";

import { useEffect, useState } from "react";

type Gym = {
  id: string;
  name: string;
};

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gymId, setGymId] = useState("");
  const [gyms, setGyms] = useState<Gym[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gyms`)
      .then((res) => res.json())
      .then(setGyms)
      .catch(console.error);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gymId) {
      alert("Please select your gym");
      return;
    }

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, gymId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Invalid credentials or wrong gym");
      return;
    }

    alert("Login successful!");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center text-red-700 mb-6">
          Sign In
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* ✅ GYM DROPDOWN */}
        <select
          value={gymId}
          onChange={(e) => setGymId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        >
          <option value="">Select Gym</option>
          {gyms.map((gym) => (
            <option key={gym.id} value={gym.id}>
              {gym.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <a
            href="/auth/signup"
            className="text-red-600 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
