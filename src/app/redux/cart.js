"use client";
import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "../supabase";
import { syncCartToSupabase } from "../services/cartService";

const getInitialCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const initialState = {
  items: getInitialCart(),
  statusTab: false,
  showNotificationTab: false,
  sideBarShow: false,
  checkoutid: null,
   isSyncing: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { store_id, store, productId, unit, qty } = action.payload;

      // 🔑 Find store by store_id (NOT name)
      const storeIndex = state.items.findIndex((s) => s.store_id === store_id);

      if (storeIndex >= 0) {
        const storeObj = state.items[storeIndex];

        // Find product
        const productIndex = storeObj.products.findIndex(
          (p) => p.productId === productId
        );

        if (productIndex >= 0) {
          const product = storeObj.products[productIndex];

          // Find unit
          const unitIndex = product.units.findIndex((u) => u.unit === unit);

          if (unitIndex >= 0) {
            product.units[unitIndex].qty += qty;
          } else {
            product.units.push({ unit, qty });
          }
        } else {
          // New product
          storeObj.products.push({
            productId,
            units: [{ unit, qty }],
          });
        }
      } else {
        // 🆕 New store
        state.items.push({
          store_id, // ✅ stored here
          store, // store name for UI
          products: [
            {
              productId,
              units: [{ unit, qty }],
            },
          ],
        });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    setCart(state, action) {
      state.items = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    changeQuantity(state, action) {
      const { store_id, productId, unit, qty } = action.payload;

      // 🔑 Find store by store_id
      const storeObj = state.items.find((s) => s.store_id === store_id);
      if (!storeObj) return;

      // Find product
      const product = storeObj.products.find((p) => p.productId === productId);
      if (!product) return;

      // Find unit
      const unitIndex = product.units.findIndex((u) => u.unit === unit);
      if (unitIndex === -1) return;

      // Update or remove unit
      if (qty > 0) {
        product.units[unitIndex].qty = qty;
      } else {
        product.units = product.units.filter((u) => u.unit !== unit);
      }

      // Remove product if no units left
      if (product.units.length === 0) {
        storeObj.products = storeObj.products.filter(
          (p) => p.productId !== productId
        );
      }

      // Remove store if no products left
      if (storeObj.products.length === 0) {
        state.items = state.items.filter((s) => s.store_id !== store_id);
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // In your cartSlice reducers
    // In your cartSlice reducers
    removeStoreFromCart(state, action) {
      const storeId = action.payload; // pass the store_id to remove

      // Remove the store from the items array by store_id
      state.items = state.items.filter((s) => s.store_id !== storeId);

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    toggleStatusTab(state) {
      state.statusTab = !state.statusTab;
      if (state.statusTab) {
        state.showNotificationTab = false; // close notification
      }
    },

    toggleSideBar(state) {
      state.sideBarShow = !state.sideBarShow;
    },

    toggleNotificationTab(state) {
      state.showNotificationTab = !state.showNotificationTab;
      if (state.showNotificationTab) {
        state.statusTab = false; // close cart
      }
    },

setIsSyncing(state, action) {
  state.isSyncing = action.payload;
},


  

    setCheckOutID(state, action) {
      state.checkoutid = action.payload;
    },
  },
});

export const {
  addToCart,
  changeQuantity,
  toggleStatusTab,
  toggleSideBar,
  toggleNotificationTab,
  setCheckOutID,
  setCart,
  removeStoreFromCart,
  setIsSyncing

} = cartSlice.actions;
export default cartSlice.reducer;
