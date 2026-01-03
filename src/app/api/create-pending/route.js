import { supabase } from "@/app/supabase";
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // 🔐 Verify session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 🛑 Prevent duplicate orders
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("checkout_session_id", sessionId)
      .single();

    if (existing) {
      return Response.json({
        success: true,
        orderId: existing.id,
        storeId: session.metadata.storeId,
      });
    }

    const {
      userId,
      storeId,
      paymentMethod = "card",
      shippingMethod = "pickup",
      totalAmount = "0",
      items = "[]",
      address = "",
      longitude = "",
      latitude = "",
    } = session.metadata;

    if (!userId || !storeId) {
      return Response.json(
        { error: "Missing userId or storeId" },
        { status: 400 }
      );
    }

    // 🧾 Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: Number(userId),
        store_id: Number(storeId),
        total_amount: Number(totalAmount),
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        status: "PENDING",
        checkout_session_id: sessionId,
        stripe_payment_intent: session.payment_intent,
        full_location: address,
        longitude: Number(longitude) || 0,
        latitude: Number(latitude) || 0,
      })
      .select()
      .single();

    if (orderError) {
      return Response.json({ error: orderError.message }, { status: 500 });
    }

    // 📦 Insert order items
    const parsedItems = JSON.parse(items || "[]");

    const orderItems = parsedItems.flatMap((p) =>
      p.units.map((u) => ({
        order_id: order.id,
        product_id: p.productId,
        product_sale_unit: u.unit,
        quantity: u.qty,
        price_at_purchase: u.price,
        subtotal: u.qty * u.price,
      }))
    );

    if (orderItems.length) {
      await supabase.from("order_items").insert(orderItems);
    }

    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("name")
      .eq("id", storeId)
      .single();

    if (storeError) {
      return Response.json(
        { error: "Failed to get store name" },
        { status: 500 }
      );
    }

    // 🧹 REMOVE CART ITEMS AFTER ORDER CREATION
    const { error: cartDeleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("store_id", Number(storeId))
      .eq(
        "cart_id",
        (
          await supabase
            .from("cart")
            .select("id")
            .eq("user_id", Number(userId))
            .single()
        ).data.id
      );

    if (cartDeleteError) {
      console.error("Failed to delete cart items:", cartDeleteError);
    }

    return Response.json({
      success: true,
      orderId: order.id,
      storeId: storeId,
    });
  } catch (err) {
    console.error("Stripe success API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
