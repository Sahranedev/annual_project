import { loadStripe, Stripe as StripeClient } from "@stripe/stripe-js";

let stripePromise: Promise<StripeClient | null>;

export const getStripeClient = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

import Stripe from "stripe";

let stripeInstance: Stripe;

export const getStripeServer = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-06-30.basil",
    });
  }
  return stripeInstance;
};
