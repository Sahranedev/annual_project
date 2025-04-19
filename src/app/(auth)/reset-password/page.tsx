"use client";
import { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "./resetPasswordAction";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;

    try {
      await resetPassword(token, newPassword);
      alert("Mot de passe mis à jour !");
      router.push("/(auth)/sign-in"); // ou autre
    } catch (err: any) {
      alert("Erreur : " + err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h1>Définir mon mot de passe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nouveau mot de passe : </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-8 w-44 border border-red-600"
          />
        </div>
        <button
          type="submit"
          disabled={!token}
          className="cursor-pointer px-4 py-2 border-blue-400 rounded-lg"
        >
          Valider
        </button>
      </form>
    </div>
  );
}
