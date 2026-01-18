"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BsPersonCircle, BsCart, BsFillCartFill } from "react-icons/bs";
import { HiLocationMarker } from "react-icons/hi";
import { FaListUl } from "react-icons/fa6";
import { XCircle } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { BiSolidBell, BiBell } from "react-icons/bi";

import { useSelector, useDispatch } from "react-redux";
import {
  toggleSideBar,
  toggleStatusTab,
  toggleNotificationTab,
} from "@/app/redux/cart";
import { toggleParentCategory, clearCategories } from "@/app/redux/filter";

import { SearchBar } from "./header/searchBar";

import { supabase } from "@/app/supabase";
import CurruncydropDown from "./header/curruncydropDown";

export default function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const carts = useSelector((store) => store.cart.items);
  const cartTab = useSelector((store) => store.cart.statusTab);
  const notiTab = useSelector((store) => store.cart.showNotificationTab);
  const SideBarShow = useSelector((store) => store.cart.sideBarShow);
  const [address, setAddress] = useState("");
  const userId = 1;

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearchBar = () => setIsSearchOpen(!isSearchOpen);

  const dispatch = useDispatch();

  useEffect(() => {
    let total = 0;
    carts.forEach((item) => (total += 1));
    setTotalQuantity(total);
  }, [carts]);

  const handleOpenCart = () => {
    dispatch(toggleStatusTab());
  };

  const handleToggleNotification = () => {
    dispatch(toggleNotificationTab());
  };

  useEffect(() => {
    console.log(SideBarShow);
  }, [SideBarShow]);

  const handleToggleSideBar = () => {
    dispatch(toggleSideBar());
  };

  const handleToggleAll = (parentcat, subcat) => {
    dispatch(clearCategories());
    dispatch(toggleParentCategory({ parent: parentcat, subcatList: subcat }));
  };

  // useEffect(()=>{
  //   dispatch(toggleParentCategory({ selected, selectedsubcat }));
  // },[selected])

  useEffect(() => {
    const stored = localStorage.getItem("user_info");
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored));
      } catch {
        console.error("Invalid user_info JSON");
      }
    }
  }, []);

  useEffect(() => {
    if (!userInfo?.id) return; // exit if no user yet

    const fetchAddress = async () => {
      try {
        const { data } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", userInfo.id)
          .maybeSingle();

        if (data) {
          setAddress(data.full_location); // ✅ use `data`
        } else {
          setAddress("No address");
        }
      } catch (err) {
        console.error("Failed to fetch address:", err);
      }
    };

    fetchAddress();
  }, [userInfo]);

  // bg-[#228B22]
  return (
    <header
      className="fixed top-0 z-498 w-full backdrop-blur-md
      bg-linear-to-r from-green-800 to-emerald-600
      border-white/10 shadow-lg"
    >
      {/* ===================== */}
      {/* TOP ROW */}
      {/* ===================== */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-17.5">
        {/* LOGO */}
        <Link href="/home" className="flex items-center">
          <img
            src="/assets/pharmat_logo_white_cropped.png"
            alt="Logo"
            className="h-9 sm:h-12 w-auto object-contain"
          />
        </Link>

        <Link
          href="/location"
          className=" items-center gap-2 px-4 py-2 text-white hidden lg:flex"
        >
          <HiLocationMarker size={22} />
          <div className="leading-tight">
            <span className="text-[10px] opacity-80">Location</span>
            <p className="text-sm font-semibold flex">
              {address || "No address"}
            </p>
          </div>
        </Link>

        {/* DESKTOP SEARCH */}
        <div className="hidden lg:flex flex-1 max-w-125 mx-10">
          <SearchBar />
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4 sm:gap-6 text-white">
          {/* SEARCH TOGGLE (Mobile) */}
          <button
            className="lg:hidden hover:scale-110 transition"
            onClick={toggleSearchBar}
          >
            {isSearchOpen ? <XCircle /> : <FaSearch />}
          </button>

          {/* PROFILE */}
          <Link href="/user_page" className="hover:scale-110 transition">
            <BsPersonCircle size={26} />
          </Link>

          {/* CART */}
          <button
            className="relative hover:scale-110 transition font-bold"
            onClick={handleOpenCart}
          >
            {cartTab ? <BsFillCartFill size={26} /> : <BsCart size={26} />}

            {totalQuantity > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white
                text-[10px] rounded-full w-4 h-4 flex items-center justify-center"
              >
                {totalQuantity}
              </span>
            )}
          </button>

        <CurruncydropDown id="currencySwapDropDown" />

        <button
          className="hover:scale-110 transition"
          onClick={handleToggleNotification}
        >
          {notiTab ? <BiSolidBell size={24} /> : <BiBell size={24} />}
        </button>
      </div>
        </div>
     

      {/* ===================== */}
      {/* SECOND ROW (MOBILE) */}
      {/* ===================== */}

      {/* MOBILE SEARCH */}
      {isSearchOpen && (
        <div className="px-4 pb-2 lg:hidden">
          <SearchBar />
        </div>
      )}

      {/* LOCATION (when search closed) */}
      {!isSearchOpen && (
        <Link
          href="/location"
          className="flex items-center gap-2 px-4 py-2 text-white lg:hidden"
        >
          <HiLocationMarker size={22} />
          <div className="leading-tight">
            <span className="text-[10px] opacity-80">Location</span>
            <p className="text-sm font-semibold flex">
              {address || "No address"}
            </p>
          </div>
        </Link>
      )}

      {/* ===================== */}
      {/* THIRD ROW (MOBILE UTILITIES) */}
      {/* ===================== */}
      {/* <div className="flex items-center justify-between px-4 py-2 text-white sm:hidden">
        <CurruncydropDown id="currencySwapDropDown" />

        <button
          className="hover:scale-110 transition"
          onClick={handleToggleNotification}
        >
          {notiTab ? <BiSolidBell size={24} /> : <BiBell size={24} />}
        </button>
      </div> */}

      {/* ===================== */}
      {/* BOTTOM NAV */}
      {/* ===================== */}
      <div
        className="w-full bg-green-900 h-9.5 sm:h-10 flex items-center
        px-3 sm:px-6 text-white overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        <ul className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
          {/* SIDEBAR */}
          <button
            onClick={handleToggleSideBar}
            className="flex items-center gap-2 hover:text-lime-300 transition"
          >
            <FaListUl size={22} />
            <span className="hidden sm:inline">Categories</span>
          </button>

          {/* ALL PRODUCTS */}
          <li>
            <Link
              href="/products"
              onClick={() => dispatch(clearCategories())}
              className="hover:text-lime-300 transition"
            >
              <span className="hidden sm:inline">All Products</span>
              <span className="sm:hidden">All</span>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
// export default Header;
