"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "En cours d'envoi" | "Envoyé" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("En cours d'envoi");
    setError(null);

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus("Envoyé");
    } else {
      const body = await res.json();
      setError(body.error || "Erreur lors de l’envoi");
      setStatus("error");
    }
  }

  return (
    <div className="flex w-full h-[500px]">
      <div className="w-1/3 bg-[#d9d0c2]" />
      <div className="w-2/3 flex flex-col justify-center px-16 py-10">
        <div className="w-1/2 mx-auto">
          <h3 className="mb-4 text-xl font-semibold">Mot de passe oublié</h3>

          {status === "Envoyé" ? (
            <p className="text-green-600">
              Un email de réinitialisation a été envoyé !
              <button
                onClick={() => router.push("/sign-in")}
                className="mt-4 block text-pink-600 hover:underline"
              >
                Retour à la connexion
              </button>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Votre adresse e-mail <span className="text-red-700">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full border border-gray-300 p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={status === "En cours d'envoi"}
                className="w-fit rounded bg-pink-100 px-4 py-2 text-black hover:bg-pink-200 cursor-pointer disabled:opacity-50"
              >
                {status === "En cours d'envoi" ? "Envoi…" : "Envoyer le lien"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
