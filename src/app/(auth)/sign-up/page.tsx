"use client";
import { useState, FormEvent } from "react";

export default function SignUp() {
  // State pour le username et l'email
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");

  // Gestion du submit
  async function handleSignUp(e: FormEvent) {
    e.preventDefault();

    try {
      // Appel vers notre route "server" (en Next.js) qui :
      // - Génère un password aléatoire
      // - Crée l’utilisateur dans Strapi
      // - Envoie l’email de reset
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
      // Optionnel : réinitialiser les champs
      setSignUpUsername("");
      setSignUpEmail("");
    } catch (err: any) {
      console.error(err);
      alert("Une erreur est survenue : " + err.message);
    }
  }

  return (
    <div className="flex w-full h-[500px]">
      {/* Bloc de gauche (fond beige) */}
      <div className="w-1/3 bg-[#d9d0c2]" />

      {/* Bloc de droite */}
      <div className="w-2/3 flex flex-col justify-center px-16 py-10">
        <div className="flex flex-row gap-16">
          {/* FORMULAIRE LOGIN (inchangé) */}
          <div className="w-1/2">
            <h3 className="mb-4 text-xl font-semibold">Se connecter</h3>
            <form className="flex flex-col gap-4">
              {/* Identifiant / email */}
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
                />
              </div>

              {/* Mot de passe */}
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
                />
              </div>

              {/* Se souvenir / bouton */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Se souvenir de moi
                  </span>
                </label>
              </div>

              <button className="w-fit rounded bg-pink-100 px-4 py-2 text-black hover:bg-pink-200 cursor-pointer">
                Se connecter
              </button>

              <div>
                <a
                  href="/forgot-password"
                  className="text-sm text-pink-600 hover:underline"
                >
                  Mot de passe perdu ?
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

              {/* Adresse e-mail */}
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
