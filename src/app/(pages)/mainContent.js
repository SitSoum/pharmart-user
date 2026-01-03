"use client";

import { useRef, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import CartTab from "@/components/cart/cartTab";
import SideBar from "@/components/layout/sideBar";
import NotificationTab from "@/components/layout/notificationTab";
import {
  syncCartToSupabase,
  getUserIdFromStorage,
} from "../services/cartService";
import { setIsSyncing } from "../redux/cart";
import NextTopLoader from "nextjs-toploader";

export default function MainContent({ children }) {
  const statusTab = useSelector((store) => store.cart.statusTab);
  const sideBarShow = useSelector((store) => store.cart.sideBarShow);
  const notificationTabStatus = useSelector(
    (store) => store.cart.showNotificationTab
  );

  const cartItems = useSelector((state) => state.cart.items);
  const syncTimeout = useRef(null);
  const userId = getUserIdFromStorage();
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userId) return;

    const timer = setTimeout(async () => {
      dispatch(setIsSyncing(true));

      await syncCartToSupabase(cartItems, userId);

      dispatch(setIsSyncing(false));
    }, 1500);

    return () => clearTimeout(timer);
  }, [cartItems, userId]);

  return (<>

  
    <main
      className={`${statusTab ? "flex justify-between gap-0" : notificationTabStatus ? "flex justify-between gap-0" : ""} w-screen`}
    >
      <SideBar sideBarShow={sideBarShow} />
      <div className="w-screen flex justify-center">{children}</div>
      <CartTab statusTab={statusTab} />
      <NotificationTab notificationTabStatus={notificationTabStatus} />
    </main>

    </>
  );
}
