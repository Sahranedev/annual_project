// src/app/(auth)/reset-password/page.tsx
"use client"; // reste client
import { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code") || "";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code) return;

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        password: newPassword,
        passwordConfirmation: newPassword,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return alert("Erreur : " + (err.error || res.statusText));
    }

    alert("Mot de passe mis à jour !");
    router.push("/sign-in");
  }
  return (
    <div className="flex w-full h-[500px]">
      {/* Bloc gauche */}
      <div className="w-1/3 bg-[#d9d0c2]" />

      {/* Bloc droit */}
      <div className="w-2/3 flex flex-col justify-center px-16 py-10">
        <div className="w-1/2 mx-auto">
          <h3 className="mb-4 text-xl font-semibold">
            Réinitialiser le mot de passe
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium"
              >
                Nouveau mot de passe <span className="text-red-700">*</span>
              </label>
              <input
                id="new-password"
                type="password"
                required
                className="mt-1 w-full border border-gray-300 p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={!code}
              className="w-fit rounded bg-pink-100 px-4 py-2 text-black hover:bg-pink-200 cursor-pointer disabled:opacity-50"
            >
              Valider
            </button>
          </form>

          {!code && (
            <p className="mt-2 text-sm text-red-600">
              Lien invalide ou expiré. Veuillez vérifier votre e‑mail.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
