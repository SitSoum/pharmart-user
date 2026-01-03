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
      className={`fixed top-0 z-500 w-full backdrop-blur-md 
bg-linear-to-r from-green-800 to-emerald-600 border-white/10 shadow-lg`}
    >
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-4 sm:px-6 h-15 sm:h-17.5 relative">
        {/* LEFT: LOGO & LOCATION */}
        <div
          className={`flex items-center gap-4 sm:gap-8  ${
            isSearchOpen ? "hidden" : "block"
          } `}
        >
          <Link
            href="/home"
            className="flex items-center min-w-16 sm:min-w-21 min-h-10"
          >
            <img
              src="/assets/pharmat_logo_white_cropped.png"
              className="h-10 sm:h-12 w-auto object-contain"
              alt="Logo"
            />
          </Link>

          {/* Location */}
          <Link
            href="/location"
            className="flex items-center gap-1 sm:gap-2 text-white hover:text-gray-200 transition"
          >
            <HiLocationMarker size={22} className="sm:size-7" />
            <div className="leading-tight max-w-22.5 sm:w-25 whitespace-nowrap flex flex-col  ">
              <span className="text-[10px] sm:text-xs opacity-80">
                Location
              </span>
              <p className="text-xs sm:text-sm font-semibold lg:inline lg:overflow-visible overflow-hidden hover:overflow-visible">
                {address || "No address"}
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER : SEARCH BAR */}
        <div
          className={`
    flex-1 max-w-125 mx-3 sm:mx-10 
    ${isSearchOpen ? "block" : "hidden"}    
    lg:block                                
  `}
        >
          {isSearchOpen ? <SearchBar /> : <></>}
          {/* <SearchBar /> */}
        </div>

        {/* RIGHT : ACTION BUTTONS */}
        <div className="flex items-center gap-4 sm:gap-6 text-white">
          <button
            className="cursor-pointer hover:scale-110"
            onClick={toggleSearchBar}
          >
            {isSearchOpen ? <XCircle /> : <FaSearch />}
          </button>

          <div className=" xs:block">
            <CurruncydropDown id="currencySwapDropDown" />
          </div>

          <Link
            href="/user_page"
            className="hover:scale-110 transition-transform"
          >
            <BsPersonCircle size={26} className="sm:size-8" />
          </Link>

          {/* CART */}
          <button
            className="relative hover:scale-110 transition-transform font-bold "
            onClick={handleOpenCart}
          >
            {cartTab ? (
              <BsFillCartFill size={26} className="cursor-pointer" />
            ) : (
              <BsCart size={26} />
            )}

            {totalQuantity > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white 
          text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 
          flex items-center justify-center"
              >
                {totalQuantity}
              </span>
            )}
          </button>

          {/* NOTIFICATION */}
          <button
            className="relative hover:scale-110 transition-transform cursor-pointer"
            onClick={handleToggleNotification}
          >
            {notiTab ? <BiSolidBell size={26} /> : <BiBell size={26} />}
          </button>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div
        className="w-full bg-green-900 h-9.5 sm:h-10 flex items-center 
  px-3 sm:px-6 text-white overflow-x-auto whitespace-nowrap scrollbar-hide"
      >
        <ul className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
          {/* Sidebar Toggle */}
          <button
            onClick={handleToggleSideBar}
            className="flex items-center gap-1 sm:gap-2 hover:text-lime-300 transition"
          >
            <FaListUl size={24} className="sm:size-6" />
            <span className="hidden sm:inline">Categories</span>
          </button>

          <li>
            <Link
              href="/products"
              className="hover:text-lime-300 transition"
              onClick={() => dispatch(clearCategories())}
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
