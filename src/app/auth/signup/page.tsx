"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Gym = {
  id: string;
  name: string;
};

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gymId, setGymId] = useState("");
  const [gyms, setGyms] = useState<Gym[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gyms`)
      .then((res) => res.json())
      .then(setGyms)
      .catch(console.error);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gymId) {
      alert("Please select a gym");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, gymId }),
    });

    if (res.ok) {
      alert("Account created! Please login.");
      router.push("/auth/signin");
    } else {
      const data = await res.json();
      alert(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg p-8 rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center text-red-700 mb-6">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Sign Up
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="text-red-600 font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
