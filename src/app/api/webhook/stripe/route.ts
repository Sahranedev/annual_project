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

  // Ici, vous pouvez implémenter la logique pour:
  // 1. Mettre à jour le statut de la commande dans votre base de données
  // 2. Envoyer un e-mail de confirmation au client
  // 3. Déclencher la préparation de la commande
  // 4. Etc.
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
