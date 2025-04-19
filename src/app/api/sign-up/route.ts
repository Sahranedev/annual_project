"use server";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

// Initialise Resend avec ta clé API
const resend = new Resend(process.env.RESEND_API_KEY);

// Génère un mot de passe aléatoire
function generateRandomPassword(length = 12) {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
}

// Route API POST
export async function POST(req: Request) {
  const { username, email } = await req.json();

  if (!username || !email) {
    return NextResponse.json(
      { success: false, error: "Champs manquants." },
      { status: 400 }
    );
  }

  const randomPassword = generateRandomPassword();

  try {
    // 🔐 Créer l'utilisateur dans Strapi
    const strapiRes = await fetch(
      `${process.env.STRAPI_URL}/api/auth/local/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password: randomPassword,
        }),
      }
    );

    const strapiData = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: strapiData.error?.message || "Erreur Strapi.",
        },
        { status: 500 }
      );
    }

    // 📧 Envoie l'email avec le lien de reset
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Définissez votre mot de passe",
      html: `
        <p>Bienvenue ${username},</p>
        <p>Pour définir votre mot de passe, cliquez sur le lien ci-dessous :</p>
        <p><a href="${process.env.APP_URL}/reset-password">Définir mon mot de passe</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
