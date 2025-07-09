import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = await params.id;

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID de session requis" },
        { status: 400 }
      );
    }

    const stripe = getStripeServer();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "line_items",
        "line_items.data.price.product",
        "payment_intent",
        "customer",
        "shipping_cost.shipping_rate",
      ],
    });

    return NextResponse.json({ session });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Une erreur est survenue";
    console.error("Erreur lors de la récupération de la session:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
