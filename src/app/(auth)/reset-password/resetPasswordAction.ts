"use server";

import { tokenStore } from "../../../app/tokenStore";

export async function resetPassword(token: string, newPassword: string) {
  const STRAPI_URL = process.env.STRAPI_URL;
  const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;
  if (!STRAPI_ADMIN_TOKEN) {
    throw new Error("STRAPI_ADMIN_TOKEN is missing");
  }

  // 1) Retrouver userId depuis le token
  const userId = tokenStore.get(token);
  if (!userId) {
    throw new Error("Token invalide ou expiré");
  }

  // 2) Appeler Strapi pour mettre à jour le mot de passe
  //    ex: PUT /users/:id (Strapi v4) => nécessite d'être authentifié en tant qu'admin
  const url = `${STRAPI_URL}/users/${userId}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`, // Token admin pour pouvoir modif le user
    },
    body: JSON.stringify({
      password: newPassword,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error("Erreur MàJ password: " + JSON.stringify(err));
  }

  // 3) Supprimer le token de la Map pour qu'il ne soit plus réutilisable
  tokenStore.delete(token);
}
