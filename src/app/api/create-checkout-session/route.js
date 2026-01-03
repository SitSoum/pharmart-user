
import { promises as fs } from "fs";


import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export async function POST(req) {
  try {
    const body = await req.json();
    console.log("CHECKOUT BODY:", body);

    const {
      totalAmount,
      user_id,
      store_id,
      full_location,
      longitude,
      latitude,
      paymentMethod = "card",
      shippingMethod = "pickup",
      items,
    } = body;

    const userId = user_id;
    const storeId = store_id;
    

    if (!totalAmount || !userId || !storeId || !items?.length) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amountInCents = Math.round(Number(totalAmount) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      payment_intent_data: { capture_method: "manual" },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Order Total" },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(userId),
        storeId: String(storeId),
        paymentMethod,
        shippingMethod,
        totalAmount: String(totalAmount),
        address: full_location,
        longitude: String(longitude),
        latitude: String(latitude),
        items: JSON.stringify(items),
      },
      success_url: "http://localhost:3000/payment_success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/payment_cancel",
    });

    console.log("Created Stripe session:", session.id);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
