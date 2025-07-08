import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Identifiant et mot de passe requis" },
      { status: 400 }
    );
  }

  const strapiRes = await fetch(`${process.env.STRAPI_URL}api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier, // dans le site de la prof c'est email donc ici identifier = email
      password,
    }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return NextResponse.json(
      { error: data.error?.message || "Authentification échouée" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    jwt: data.jwt,
    user: {
      id: data.user.id,
      username: data.user.username,
    },
  });
}
