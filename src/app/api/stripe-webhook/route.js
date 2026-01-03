import Stripe from "stripe";
import { supabase } from "@/app/supabase";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  /* ✅ Payment SUCCESS */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const {
      userId,
      storeId,
      paymentMethod,
      shippingMethod,
      totalAmount,
      address,
      longitude,
      latitude,
      items,
    } = session.metadata;

    /* 1️⃣ Create order */
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: Number(userId),
        store_id: Number(storeId),
        total_amount: Number(totalAmount),
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        checkout_session_id: session.id,
        address: address,
        longitude: Number(longitude),
        latitude: Number(latitude),
        created_at: new Date(),
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      throw orderError;
    }

    /* 2️⃣ Create order items */
    const parsedItems = JSON.parse(items);
    const orderItems = [];

    parsedItems.forEach(product => {
      product.units.forEach(unit => {
        orderItems.push({
          order_id: order.id,
          product_id: product.productId,
          sale_unit_id: unit.sale_unit_id,
          quantity: unit.qty,
          price_at_purchase: unit.price,
          subtotal: unit.qty * unit.price,
          created_at: new Date(),
        });
      });
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      throw itemsError;
    }

    /* 3️⃣ Create payment (AUTHORIZED – manual capture) */
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: Number(userId),
        order_id: order.id,
        stripe_payment_intent: session.payment_intent,
        amount: Number(totalAmount),
        currency: session.currency.toUpperCase(),
        status: "AUTHORIZED",
        created_at: new Date(),
      });

    if (paymentError) {
      console.error("Payment insert error:", paymentError);
      throw paymentError;
    }
  }

  return new Response("OK", { status: 200 });
}
