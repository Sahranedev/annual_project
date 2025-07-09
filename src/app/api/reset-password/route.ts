import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, password, passwordConfirmation } = await req.json();

    const response = await fetch(
      `${process.env.STRAPI_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password, passwordConfirmation }),
      }
    );

    if (!response.ok) {
      let errorMessage = "Erreur lors de la réinitialisation du mot de passe";

      try {
        const errorData = await response.json();
        errorMessage =
          errorData.error?.message || errorData.message || errorMessage;
      } catch {
        // Si la réponse n'est pas du JSON valide
        errorMessage = `${response.status}: ${response.statusText}`;
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur reset password:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
