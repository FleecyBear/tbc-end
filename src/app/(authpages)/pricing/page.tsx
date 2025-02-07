"use client";

import React, { useEffect, useState } from "react";
import { createCheckoutSession } from "@/app/actions/stripe";
type Subscription = {
  type: string;
  benefits: string;
  price: number;
  stripe_id: string;
};

export default function PricingPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching subscriptions:", data.error);
        } else {
          setSubscriptions(data);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleCheckout = async (productId: string) => {
    setLoading(true);
    try {
      const result = await createCheckoutSession(productId);

      if (result.url) {
        window.location.href = result.url; 
      } else {
        console.error("Failed to create checkout session:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-1">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="h2-1">
          Pricing Plans
        </h1>
        <div className="grid grid-cols-3  gap-6 justify-items-center">
        {subscriptions.map((subscription) => (
            <div
              key={subscription.stripe_id}
              className="bg-slate-100 shadow-md rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {subscription.type}
                </h2>
                <p className="text-gray-600 mb-4">{subscription.benefits}</p>
                <p className="text-2xl font-bold text-gray-800">
                  ${subscription.price.toFixed(2)} / month
                </p>
              </div>
              <button
                onClick={() => handleCheckout(subscription.stripe_id)}
                className="btn-2 mt-4"
                disabled={loading}
              >
                {loading ? "Processing..." : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}