import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json(
      { error: "Adresse e-mail requise" },
      { status: 400 }
    );
  }

  const strapiUrl = process.env.STRAPI_URL;
  if (!strapiUrl) {
    console.error("Missing STRAPI_URL env var");
    return NextResponse.json(
      { error: "Configuration serveur invalide" },
      { status: 500 }
    );
  }

  const res = await fetch(`${strapiUrl}api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const body = await res.json();
  if (!res.ok) {
    console.error("forgot-password error:", res.status, body);
    return NextResponse.json(
      { error: body.error?.message || "Erreur Strapi" },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
