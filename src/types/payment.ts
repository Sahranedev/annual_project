export interface CartItemForCheckout {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CheckoutSessionRequest {
  items: CartItemForCheckout[];
  customerEmail?: string;
  metadata?: Record<string, string>;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  client_secret: string;
}

export interface StripeError {
  message: string;
  type: string;
  code?: string;
}

export interface StripeCheckoutSession {
  id: string;
  created: number;
  amount_total: number;
  currency: string;
  customer_email?: string;
  payment_status?: string;
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      postal_code: string;
      city: string;
      country: string;
    };
  };
}
