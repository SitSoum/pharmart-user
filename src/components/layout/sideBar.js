"use client";
import { FaListUl } from "react-icons/fa6";
import Link from "next/link";
import { HiX } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toggleSideBar } from "@/app/redux/cart";
import { toggleSubcategory, clearCategories } from "@/app/redux/filter";
import { useEffect, useState } from "react";
import { supabase } from "@/app/supabase";

const SideBar = ({ sideBarShow }) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("main_categories")
        .select(
          `
        id,
        name,
        sub_categories (
          id,
          name
        )
      `
        )
        .order("id");

      if (error) {
        console.error("Failed to load categories:", error);
        return;
      }

      setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleToggleSideBar = () => {
    dispatch(toggleSideBar());
  };

  const handleToggleSubcat = (parentId, subId) => {
    dispatch(clearCategories());
    dispatch(toggleSubcategory({ parent: parentId, value: subId }));
  };

  useEffect(() => {
    console.log(sideBarShow);
  }, [sideBarShow]);

  return (
    <div
      className={`fixed top-0 left-0 z-600 bg-black/60 w-screen h-screen transform transition-transform duration-500 ease-in-out ${
        sideBarShow ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-screen w-91.25 bg-white overflow-y-auto">
        {/* Header */}
        <div className="fixed top-0 z-610 w-91.25 flex flex-row justify-start items-center gap-3 text-lg py-3 px-6 text-white font-extrabold bg-emerald-600">
          <div className="flex flex-row flex-1 items-center gap-3">
            <FaListUl size={20} />
            <span className="text-xl">Categories</span>
          </div>
          <HiX
            size={24}
            className="cursor-pointer hover:text-gray-200 transition"
            onClick={handleToggleSideBar}
          />
        </div>

        {/* Categories */}
        <nav className="flex flex-col pt-15 pb-16">
          {loading && (
            <p className="px-6 text-sm text-gray-500">Loading categories...</p>
          )}

          {categories.map((cat) => (
            <section key={cat.id} className="px-6 py-3 flex flex-col">
              <span className="text-lg font-extrabold text-gray-700 mb-2">
                {cat.name}
              </span>

              {cat.sub_categories?.map((sub) => (
                <Link
                  key={sub.id}
                  href="/products"
                  className="py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md transition"
                  onClick={() => handleToggleSubcat(cat.name, sub.id)}
                >
                  {sub.name}
                </Link>
              ))}

              <hr className="border-t border-gray-200 my-3" />
            </section>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
