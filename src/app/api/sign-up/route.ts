import { NextResponse } from "next/server";
import crypto from "crypto";

function generateRandomPassword(len = 12) {
  return crypto.randomBytes(len).toString("base64").slice(0, len);
}

export async function POST(req: Request) {
  const { username, email } = await req.json();
  if (!username || !email) {
    return NextResponse.json(
      { success: false, error: "Champs manquants." },
      { status: 400 }
    );
  }

  const randomPassword = generateRandomPassword();

  // Création de l’utilisateur
  const registerRes = await fetch(
    `${process.env.STRAPI_URL}api/auth/local/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password: randomPassword }),
    }
  );
  if (!registerRes.ok) {
    const err = await registerRes.json();
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, error: err.error?.message || "Erreur register" },
      { status: 500 }
    );
  }

  // Demande de reset‑password
  const fpRes = await fetch(
    `${process.env.STRAPI_URL}api/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );

  const fpBody = await fpRes.json();
  console.log("forgot-password status:", fpRes.status, fpBody);

  if (!fpRes.ok) {
    return NextResponse.json(
      {
        success: false,
        error: fpBody.error?.message || JSON.stringify(fpBody),
      },
      { status: fpRes.status }
    );
  }

  return NextResponse.json({ success: true });
}
