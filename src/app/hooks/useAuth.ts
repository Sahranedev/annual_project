// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

type User = { id: number; username: string };

export function useAuth() {
  // user = undefined tant qu’on n’a pas appelé l’API
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No auth");
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
  };
}
