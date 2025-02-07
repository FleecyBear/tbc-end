"use server";

import type { Stripe } from "stripe";
import { headers } from "next/headers";
import { stripe } from "../lib/stripe";
async function getCookie(name: string): Promise<string | undefined> {
  const cookie = await headers();
  const cookieHeader = cookie.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : undefined;
  }
  return undefined;
}

export async function createCheckoutSession(
  productId: string,
  quantity: number = 1
): Promise<{ client_secret: string | null; url: string | null }> {
  try {
    const origin: string = (await headers()).get("origin") as string;
    const lang = (await getCookie("lang")) || "en";

    console.log("Fetching prices for productId:", productId);

    const prices = await stripe.prices.list({ product: productId });

    if (!prices.data || prices.data.length === 0) {
      throw new Error(`No prices found for product ID: ${productId}`);
    }

    const price = prices.data[0];
    console.log("Using price:", price);

    const isSubscription = price.type === "recurring";

    console.log("Determined mode:", isSubscription ? "subscription" : "payment");

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          quantity,
          price: price.id, 
        },
      ],
      success_url: `${origin}/${lang}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${lang}/`,
    });

    console.log("Checkout session created:", checkoutSession);

    return {
      client_secret: checkoutSession.client_secret,
      url: checkoutSession.url,
    };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return {
      client_secret: null,
      url: null,
    };
  }
}