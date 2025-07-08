import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { CheckoutSessionRequest } from "@/types/payment";

export async function POST(request: Request) {
  try {
    const body: CheckoutSessionRequest = await request.json();
    const { items, customerEmail, metadata = {}, successUrl, cancelUrl } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Aucun article dans le panier" },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

    const line_items = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Conversion en centimes
      },
      quantity: item.quantity,
    }));

    const stripe = getStripeServer();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email: customerEmail,
      success_url:
        successUrl ||
        `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/cart`,
      metadata,
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "LU", "CH"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 490,
              currency: "eur",
            },
            display_name: "Livraison standard",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 3,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 990,
              currency: "eur",
            },
            display_name: "Livraison express",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 2,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Une erreur est survenue";
    console.error(
      "Erreur lors de la création de la session de paiement:",
      error
    );
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
