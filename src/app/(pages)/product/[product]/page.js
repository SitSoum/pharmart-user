"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/redux/cart";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/supabase";

import {
  getUserIdFromStorage,
  syncCartToSupabase,
} from "@/app/services/cartService";

export default function ProductDetail() {
  const { product } = useParams();
  const [detail, setDetail] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setUnit] = useState();
  const [selectedImage, setImage] = useState();
  const [loading, setLoading] = useState(true);

  const syncTimeout = useRef(null);
  const userId = getUserIdFromStorage();

  const cartItems = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();



  // 1️⃣ Fetch product details from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(
          `id,
    name,
    slug,
    description,
    image_url,
    product_sale_units (
      id,
      unit_name,
      price,
      is_default_unit,
      stock_quantity
    ),
    products_sub_images (
      image_url
    ),
    sub_categories(
      name
    ),
    main_categories (
      name
    ),
    stores (
      id,
      name,
      slug
    )
  `
        )
        .eq(isNaN(product) ? "slug" : "id", product)
        .maybeSingle();

      if (!error && data) {
        setDetail({
          ...data,
          sale_units: data.product_sale_units.map((u) => ({
            unit: u.unit_name,
            price: parseFloat(u.price),
            is_default: u.is_default_unit,
            stock: u.stock_quantity,
          })),
          sub_images: data.products_sub_images.map((img) => img.image_url),
          store_id: data.stores?.id,
          store: data.stores?.name,
          store_slug: data.stores?.slug,
          categories: data.main_categories ? [data.main_categories.name] : [],
          sub_categories: data.sub_categories ? [data.sub_categories.name] : [],
        });

        setUnit(
          data.product_sale_units.find((u) => u.is_default_unit)?.unit_name
        );
        setImage(data.image_url || data.products_sub_images?.[0]?.image_url);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [product]);

  if (loading || !detail) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg h-screen w-screen">
        Loading product details...
      </div>
    );
  }

  // -------------------------
  // Quantity Handlers
  // -------------------------
  const handleMinusQuantity = () =>
    setQuantity((prev) => Math.max(1, prev - 1));

  const handlePlusQuantity = () => setQuantity((prev) => prev + 1);

  // -------------------------
  // Add To Cart
  // -------------------------
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        store_id: detail.store_id,
        store: detail.store,
        productId: detail.id,
        unit: selectedUnit,
        qty: quantity,
      })
    );
  };
return (
  <div
    className="
      pt-28 px-4 sm:px-8 lg:px-16
      min-h-screen
      bg-linear-to-br from-slate-50 to-green-50
      flex flex-col
    "
  >
    {/* TITLE */}
    <h2 className="text-3xl sm:text-4xl font-extrabold text-center tracking-wide text-slate-800 mb-12">
      Product Detail
    </h2>

    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start justify-center">
      {/* IMAGE SECTION */}
      <div className="flex flex-col">
        <div
          className="
            relative bg-white/70 backdrop-blur-xl
            rounded-3xl shadow-xl
            overflow-hidden
            max-w-130 w-full aspect-square
            flex items-center justify-center mx-auto
            border border-white/50
          "
        >
          {/* Blurred background */}
          <img
            src={selectedImage}
            alt={detail.name}
            className="absolute inset-0 w-full h-full object-cover blur-md brightness-75 scale-110"
          />

          {/* Main image */}
          <img
            src={selectedImage}
            alt={detail.name}
            className="relative z-10 w-auto h-[90%] object-contain"
          />
        </div>

        {/* Thumbnails */}
        <div className="flex gap-3 overflow-x-auto mt-4 justify-center">
          <img
            className="
              aspect-square max-w-18
              rounded-xl
              border border-gray-200
              hover:border-green-600
              hover:ring-2 hover:ring-green-200
              cursor-pointer transition
            "
            src={detail.image_url}
            onClick={() => setImage(detail.image_url)}
          />

          {detail.sub_images.map((sub_image, i) => (
            <img
              key={i}
              className="
                aspect-square max-w-18
                rounded-xl
                border border-gray-200
                hover:border-green-600
                hover:ring-2 hover:ring-green-200
                cursor-pointer transition
              "
              src={sub_image}
              onClick={() => setImage(sub_image)}
            />
          ))}
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="flex flex-col gap-6 flex-1 text-slate-800 max-w-3xl">
        {/* Name & Store */}
        <div>
          <h1 className="text-4xl font-extrabold mb-1">
            {detail.name}
          </h1>

          <Link
            href={`/store/${detail.store_slug}`}
            className="
              text-sm uppercase tracking-wider
              font-semibold text-green-700
              hover:text-green-900 transition
            "
          >
            {detail.store}
          </Link>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {[...detail.categories, ...detail.sub_categories].map((cat, i) => (
            <span
              key={i}
              className="
                bg-green-100 text-green-800
                px-4 py-1 rounded-full
                text-sm font-medium
                hover:bg-green-200
                cursor-pointer transition
              "
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Units */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-3">
            Available Units
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {detail.sale_units.map((unit, i) => {
              const isOutOfStock = unit.stock <= 0;
              const isSelected = selectedUnit === unit.unit;

              return (
                <div
                  key={i}
                  onClick={() => !isOutOfStock && setUnit(unit.unit)}
                  className={`
                    rounded-2xl p-4 border transition-all cursor-pointer
                    ${
                      isSelected
                        ? "border-green-600 ring-2 ring-green-200 bg-green-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }
                    ${
                      isOutOfStock &&
                      "opacity-50 cursor-not-allowed bg-gray-100"
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold capitalize text-lg">
                      {unit.unit}
                    </span>

                    <span className="font-bold text-slate-900">
                      ${unit.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    {isOutOfStock ? (
                      <span className="text-red-600 font-semibold">
                        Out of stock
                      </span>
                    ) : (
                      <span className="text-green-700 font-medium">
                        In stock: {unit.stock}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mt-6">
          <div
            className="
              flex items-center gap-3
              bg-white rounded-xl
              border border-gray-200
              px-3 py-2 shadow-sm
            "
          >
            <button
              className="
                w-10 h-10 rounded-lg
                bg-green-100 hover:bg-green-200
                text-green-800 font-bold text-xl
                transition
              "
              onClick={handleMinusQuantity}
            >
              −
            </button>

            <span className="w-10 text-center text-xl font-semibold">
              {quantity}
            </span>

            <button
              className="
                w-10 h-10 rounded-lg
                bg-green-100 hover:bg-green-200
                text-green-800 font-bold text-xl
                transition
              "
              onClick={handlePlusQuantity}
            >
              +
            </button>
          </div>

          <button
            disabled={
              !selectedUnit ||
              detail.sale_units.find(
                (u) => u.unit === selectedUnit
              )?.stock <= 0
            }
            className="
              bg-linear-to-r from-green-700 to-emerald-600
              hover:from-green-800 hover:to-emerald-700
              text-white px-10 py-3 rounded-xl
              font-semibold shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
            "
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>

        {/* Description */}
        <div className="mt-4 max-w-2xl leading-relaxed text-gray-700 text-justify">
          <p>{detail.description}</p>
        </div>
      </div>
    </div>

    {/* SIMILAR PRODUCTS */}
    <div className="mt-16">
      <h3 className="text-xl font-bold text-slate-800 mb-3">
        Similar Products
      </h3>

      <hr className="h-0.5 w-24 bg-green-600 rounded-full mb-6" />
    </div>
  </div>
);

}
