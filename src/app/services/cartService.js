import { supabase } from "@/app/supabase";


export const getUserIdFromStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) return null;

    return JSON.parse(userInfo).id;
  } catch {
    return null;
  }
};

export const getStoreIdByName = async (store_name) => {
  const { data, error } = await supabase
    .from("stores")
    .select("id")
    .eq("name", store_name)
    .single();

  if (error) {
    console.error("Failed to get store id:", error);
    return null;
  }

  console.log("name:", store_name)
  return data.id;
};


// 1️⃣ Get or create cart
export const getOrCreateCart = async (userId) => {
  const { data: cart } = await supabase
    .from("cart")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (cart) return cart.id;

  const { data: newCart, error } = await supabase
    .from("cart")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error) throw error;

  return newCart.id;
};

// 2️⃣ Sync Redux cart → Supabase
export const syncCartToSupabase = async (cartItems, userId) => {
  

  const cartId = await getOrCreateCart(userId);
  console.log(cartItems)
  
  if (!cartItems || cartItems.length === 0) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);

    return;
  }

  // Clear old items
  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  const rows = [];

  for (const store of cartItems) {
    const { data: storeRow } = await supabase
      .from("stores")
      .select("id")
      .eq("name", store.store)
      .single();

    if (!storeRow) continue;

    for (const product of store.products) {
      for (const unit of product.units) {
        const { data: unitRow } = await supabase
          .from("product_sale_units")
          .select("id")
          .eq("unit_name", unit.unit)
          .eq("product_id", product.productId)
          .single();

        if (!unitRow) continue;

        rows.push({
          cart_id: cartId,
          store_id: storeRow.id,
          product_id: product.productId,
          sale_unit_id: unitRow.id,
          quantity: unit.qty,
        });
      }
    }
  }

  if (rows.length > 0) {
    await supabase.from("cart_items").insert(rows);
  }
};


export const loadCartFromSupabase = async (userId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      quantity,
      product_id,
      product_sale_units (
        unit_name
      ),
      stores (
        name
      )
    `)
    .eq("cart.user_id", userId);

  if (error) throw error;

  // 🔄 Convert DB → Redux format
  const cartMap = {};

  for (const row of data) {
    const storeName = row.stores.name;

    if (!cartMap[storeName]) {
      cartMap[storeName] = {
        store: storeName,
        products: []
      };
    }

    let product = cartMap[storeName].products.find(
      p => p.productId === row.product_id
    );

    if (!product) {
      product = {
        productId: row.product_id,
        units: []
      };
      cartMap[storeName].products.push(product);
    }

    product.units.push({
      unit: row.product_sale_units.unit_name,
      qty: row.quantity
    });
  }

  return Object.values(cartMap);
};
