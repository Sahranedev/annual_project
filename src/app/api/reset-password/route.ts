import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code, password, passwordConfirmation } = await req.json();
  const res = await fetch(`${process.env.STRAPI_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, password, passwordConfirmation }),
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { success: false, error: data.error?.message || "Erreur Strapi" },
      { status: res.status }
    );
  }
  return NextResponse.json({ success: true });
}
