import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { UserProfile } from "@/types/user";
import ApiHelper from "../ApiHelper";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { token, user, isAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Récupérer les informations de base de l'utilisateur
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/"}api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!userResponse.ok) throw new Error("Échec de l'authentification");

        const userData = await userResponse.json();

        // Récupérer les adresses de l'utilisateur
        const addressesResponse = await ApiHelper(
          `user-addresses?filters[user_id][$eq]=${userData.id}`,
          "GET",
          null,
          token
        );

        // Créer le profil complet
        const fullProfile: UserProfile = {
          ...userData,
          addresses: addressesResponse.data || [],
        };

        setUser(fullProfile);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          error
        );
        useAuthStore.getState().logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, setUser]);

  return {
    user,
    isAuthenticated,
    loading,
  };
}
