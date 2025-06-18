import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

type User = { id: number; username: string };

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { token, user, isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    if (!token) {
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
        useAuthStore.getState().logout();
      })
      .finally(() => setLoading(false));
  }, [token, setUser]);

  return {
    user,
    isAuthenticated,
    loading,
  };
}
