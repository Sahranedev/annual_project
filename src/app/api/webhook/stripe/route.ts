import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripeServer } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  console.log("Webhook Stripe reçu");

  if (!signature) {
    console.error("Signature Stripe manquante");
    return NextResponse.json(
      { error: "Signature Stripe manquante" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripeServer();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("La clé secrète du webhook Stripe n'est pas configurée");
      throw new Error("La clé secrète du webhook Stripe n'est pas configurée");
    }

    console.log("Vérification de la signature du webhook...");

    // Vérifie la signature du webhook pour être sur que c'est bien stripe qui nous envoie le webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log(`Événement Stripe reçu: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Erreur webhook:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log("Paiement réussi:", session);
  console.log("ID de session:", session.id);
  console.log("Client:", session.customer_email);
  console.log(
    "Montant total:",
    session.amount_total ? session.amount_total / 100 : "N/A"
  );
  console.log("Devise:", session.currency);
  console.log("Statut de paiement:", session.payment_status);

  if (session.customer_email) {
    try {
      console.log(
        `Mise à jour de isVerified pour l'utilisateur: ${session.customer_email}`
      );

      const BACKEND_URL =
        process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

      const apiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

      if (!apiToken) {
        throw new Error("Token API Strapi non configuré");
      }

      const userResponse = await fetch(
        `${BACKEND_URL}/api/users?filters[email]=${encodeURIComponent(session.customer_email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const userData = await userResponse.json();

      console.log("Réponse de recherche utilisateur:", userData);

      if (!userResponse.ok) {
        throw new Error(
          `Erreur lors de la recherche de l'utilisateur: ${userData.error?.message || "Erreur inconnue"}`
        );
      }

      if (userData && userData.length > 0) {
        const userId = userData[0].id;

        const updateResponse = await fetch(
          `${BACKEND_URL}/api/users/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isVerified: true,
            }),
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(
            `Erreur lors de la mise à jour de l'utilisateur: ${errorData.error?.message || "Erreur inconnue"}`
          );
        }

        console.log(`Utilisateur ${userId} marqué comme vérifié avec succès`);
      } else {
        console.log(
          `Aucun utilisateur trouvé avec l'email: ${session.customer_email}`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de isVerified:", error);
    }
  }

  console.log("Traitement de la session de paiement terminé");
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log("Intent de paiement réussi:", paymentIntent);
  console.log("ID du paiement:", paymentIntent.id);
  console.log("Montant:", paymentIntent.amount / 100);
  console.log("Devise:", paymentIntent.currency);
  console.log("Méthode de paiement:", paymentIntent.payment_method_types);

  // Logique supplémentaire si nécessaire
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Échec de l'intent de paiement:", paymentIntent);
  console.log("ID du paiement:", paymentIntent.id);
  console.log("Erreur:", paymentIntent.last_payment_error?.message);

  // Logique pour gérer les échecs de paiement
}

// Configuration pour désactiver le parsing du corps de la requête car nous avons besoin du corps brut pour la vérification de la signature
export const config = {
  api: {
    bodyParser: false,
  },
};
