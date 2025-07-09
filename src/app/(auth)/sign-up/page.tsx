"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function SignUp() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur de connexion");
      }

      setToken(data.jwt);
      setUser(data.user);

      if (rememberMe) {
        localStorage.setItem("remember", "true");
      }
      router.push("/");
    } catch (err: Error | unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      alert("Erreur de connexion : " + errorMessage);
    }
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signUpUsername,
          email: signUpEmail,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      alert(
        "Inscription réussie, vérifiez votre boîte mail pour définir votre mot de passe !"
      );
      setSignUpUsername("");
      setSignUpEmail("");
    } catch (err: Error | unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      alert("Une erreur est survenue : " + errorMessage);
    }
  }

  return (
    <div className="flex w-full h-[500px]">
      {/* Bloc de gauche (fond beige) */}
      <div className="w-1/3 bg-[#d9d0c2]" />

      {/* Bloc de droite */}
      <div className="w-2/3 flex flex-col justify-center px-16 py-10">
        <div className="flex flex-row gap-16">
          {/* FORMULAIRE LOGIN */}
          <div className="w-1/2">
            <h3 className="mb-4 text-xl font-semibold">Se connecter</h3>
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium"
                >
                  Identifiant ou e-mail <span className="text-red-700">*</span>
                </label>
                <input
                  id="login-email"
                  type="text"
                  className="mt-1 w-full border border-gray-300 p-2"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium"
                >
                  Mot de passe <span className="text-red-700">*</span>
                </label>
                <input
                  id="login-password"
                  type="password"
                  className="mt-1 w-full border border-gray-300 p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 text-pink-600 focus:ring-pink-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Se souvenir de moi
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-fit rounded bg-pink-100 px-4 py-2 text-black hover:bg-pink-200 cursor-pointer"
              >
                Se connecter
              </button>

              <div>
                <a
                  href="/forgot-password"
                  className="text-sm text-pink-600 hover:underline"
                >
                  Mot de passe perdu ?
                </a>
              </div>
            </form>
          </div>

          {/* FORMULAIRE INSCRIPTION */}
          <div className="w-1/2">
            <h3 className="mb-4 text-xl font-semibold">S&apos;inscrire</h3>
            <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
              {/* Username */}
              <div>
                <label
                  htmlFor="signup-username"
                  className="block text-sm font-medium"
                >
                  Nom d&apos;utilisateur <span className="text-red-700">*</span>
                </label>
                <input
                  id="signup-username"
                  type="text"
                  className="mt-1 w-full border border-gray-300 p-2"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-medium"
                >
                  Adresse e-mail <span className="text-red-700">*</span>
                </label>
                <input
                  id="signup-email"
                  type="email"
                  className="mt-1 w-full border border-gray-300 p-2"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
              </div>

              <p className="text-sm text-gray-700">
                Un lien permettant de définir un nouveau mot de passe sera
                envoyé à votre adresse e-mail. Vous pourrez alors choisir le mot
                de passe de votre choix.
              </p>

              <button
                type="submit"
                className="w-fit rounded bg-pink-100 px-4 py-2 text-black hover:bg-pink-200 cursor-pointer"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
