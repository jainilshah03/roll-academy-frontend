"use client";

import { useEffect, useState } from "react";

type MeUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

export function useMe() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
  };
}
