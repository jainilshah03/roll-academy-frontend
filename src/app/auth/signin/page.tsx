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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/gyms")
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array before setting
        if (Array.isArray(data)) {
          setGyms(data);
        } else {
          console.error("Gyms API did not return an array:", data);
          setGyms([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching gyms:", error);
        setGyms([]);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!gymId) {
      setError("Please select your gym");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, gymId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials or wrong gym");
        setLoading(false);
        return;
      }

      // Success!
      setSuccess(true);
      setError("");

      // Redirect after a short delay to show success message
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            ✅ Login successful! Redirecting...
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {/* ✅ GYM DROPDOWN */}
        <select
          value={gymId}
          onChange={(e) => setGymId(e.target.value)}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
          disabled={loading}
        >
          <option value="">Select Gym</option>
          {gyms?.map((gym) => (
            <option key={gym.id} value={gym.id}>
              {gym.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
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
