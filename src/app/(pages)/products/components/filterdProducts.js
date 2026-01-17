"use client";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/app/supabase";
import { filterdData } from "../functions";

const FilterdProducts = ({ setNumResult }) => {
  const searchParam = useSelector((state) => state.search.searchParam);
  const selectedFilters = useSelector((state) => state.filter.selected);

  const [products, setProducts] = useState([]);
  const [resultIDs, setResultIDs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(
          `
    id,
    name,
    slug,
    image_url,
    description,
    main_categories(name),
    sub_category_id,
    product_sale_units (
      unit_name,
      price,
      is_default_unit,
      stock_quantity
    ),
    store:stores!inner(
      id,
      name,
      validated
    )
  `
        )
        .eq("visible", true) // products.visible = true
        .eq("store.validated", true); // stores.validated = true

      if (!error) setProducts(data ?? []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // 2️⃣ Apply filters
  useEffect(() => {
    if (!products.length) return;

    const ids = filterdData(products, selectedFilters, searchParam, 1, 10);
    setResultIDs(ids);
    setNumResult(ids.length); // ✅ correct
  }, [products, selectedFilters, searchParam]);

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
    console.log("Selected Values:", Object.values(selectedFilters).flat());
    console.log(
      "Products IDs:",
      products.map((p) => p.id)
    );
  }, [selectedFilters]);

  // 3️⃣ Empty state
  if (!loading && !resultIDs.length) {
    return (
      <section className="flex w-full h-screen justify-center items-center text-gray-500">
        No products found
      </section>
    );
  }

  // 4️⃣ Final filtered products
  const filteredProducts = products.filter((p) => resultIDs.includes(p.id));

  return (
    // <section className="flex w-full h-screen overflow-y-auto">
    //   <div className="flex flex-col px-10 w-full">
    //     {filteredProducts.map((product) => {
    //       const allOutOfStock =
    //         !product.product_sale_units ||
    //         product.product_sale_units.length === 0 ||
    //         product.product_sale_units.every((u) => u.stock_quantity <= 0);

    //       return (
    //         <Link
    //           key={product.id}
    //           href={`/product/${product.slug}`}
    //           className="flex p-5 border-b border-gray-200 hover:bg-gray-50 hover:shadow-lg transition rounded-xl"
    //         >
    //           <img
    //             src={product.image_url}
    //             alt={product.name}
    //             className="w-36 h-36 rounded-lg object-contain shadow-md shrink-0"
    //           />

    //           <div className="ml-6 flex flex-col justify-between flex-1">
    //             <p className="font-extrabold text-xl text-gray-800">
    //               {product.name}
    //             </p>

    //             <p className="text-base text-gray-600 my-2 line-clamp-1 wrap-break-word">
    //               {product.description}
    //             </p>

    //             <label
           
    //           className="
    //            inline-flex self-start
    //             bg-green-100 text-green-800
    //             px-4 py-1 rounded-full
    //             text-sm font-medium
    //             hover:bg-green-200
    //             cursor-pointer transition
    //           "
    //         >
    //           {product.main_categories? product.main_categories.name: "uncategorized" }
    //         </label>

    //             {allOutOfStock ? (
    //               <p className="text-xl font-extrabold text-red-600">
    //                 Out of stock
    //               </p>
    //             ) : (
    //               <div className="flex flex-col gap-1">
    //                 {product.product_sale_units.map((u, i) => (
    //                   <p
    //                     key={i}
    //                     className={`text-sm font-semibold
    //               ${
    //                 u.stock_quantity <= 0 ? "text-gray-400" : "text-emerald-700"
    //               }
    //             `}
    //                   >
    //                     ${u.price} / {u.unit_name} — Stock: {u.stock_quantity}
    //                   </p>
    //                 ))}
    //               </div>
    //             )}
    //           </div>
    //         </Link>
    //       );
    //     })}
    //   </div>
    // </section>
    <section className="flex w-full h-screen overflow-y-auto">
  <div className="flex flex-col px-10 w-full gap-3">
    {filteredProducts.map((product) => {
      const allOutOfStock =
        !product.product_sale_units ||
        product.product_sale_units.length === 0 ||
        product.product_sale_units.every((u) => u.stock_quantity <= 0);

      return (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          className="
            flex gap-6 p-5
            border border-gray-200 rounded-xl
            hover:bg-gray-50 hover:shadow-md
            transition
          "
        >
          {/* Image */}
          <img
            src={product.image_url}
            alt={product.name}
            className="
              w-36 h-36 rounded-lg
              object-contain shadow-md
              shrink-0 self-start
            "
          />

          {/* Content */}
          <div className="flex flex-col flex-1 justify-between">
            {/* TOP */}
            <div className="flex flex-col gap-1">
              <p className="font-extrabold text-xl text-gray-800 line-clamp-2 wrap-break-word">
                {product.name}
              </p>

              <p className="text-sm text-gray-500 font-medium">
  {product.store?.name}
</p>

              <p className="text-base text-gray-600 line-clamp-1 wrap-break-word">
                {product.description}
              </p>

              <span
                className="
                  inline-flex self-start
                  bg-green-100 text-green-800
                  px-3 py-1 rounded-full
                  text-sm font-medium
                  max-w-full truncate
                "
                title={product.main_categories?.name}
              >
                {product.main_categories?.name || "uncategorized"}
              </span>
            </div>

            {/* BOTTOM */}
            <div className="mt-3">
              {allOutOfStock ? (
                <p className="text-lg font-extrabold text-red-600">
                  Out of stock
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {product.product_sale_units.map((u, i) => (
                    <p
                      key={i}
                      className={`text-sm font-semibold ${
                        u.stock_quantity <= 0
                          ? "text-gray-400"
                          : "text-emerald-700"
                      }`}
                    >
                      ${u.price} / {u.unit_name} — Stock: {u.stock_quantity}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      );
    })}
  </div>
</section>

  );
};

export default FilterdProducts;
