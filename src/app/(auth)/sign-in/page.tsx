"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      return alert("Erreur de connexion : " + data.error);
    }

    // Stocke le token et redirige
    localStorage.setItem("token", data.jwt);
    router.push("/profile");
  }

  return (
    <div className="flex w-full h-[500px]">
      <div className="w-1/3 bg-[#d9d0c2]" />
      <div className="w-2/3 flex flex-col justify-center px-16 py-10">
        <div className="w-1/2 mx-auto">
          <h3 className="mb-4 text-xl font-semibold">Se connecter</h3>
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium">
                E-mail <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                required
                className="mt-1 w-full border border-gray-300 p-2"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Mot de passe <span className="text-red-700">*</span>
              </label>
              <input
                type="password"
                required
                className="mt-1 w-full border border-gray-300 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-fit rounded bg-pink-100 px-4 py-2 text-black hover:bg-pink-200 cursor-pointer"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
