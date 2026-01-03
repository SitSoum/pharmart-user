"use client";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/redux/cart";

const ProductCard = ({ data }) => {
  const {
    id,
    name,
    image_url,
    product_sale_units = [], // Supabase field
    slug,
    store
  } = data;

  const dispatch = useDispatch();

  // 🧠 Determine if product is out of stock
  const isOutOfStock =
    product_sale_units.length === 0 ||
    product_sale_units.every(u => u.stock_quantity <= 0);

  // 🧠 Select default unit or first available
  const defaultUnit =
    product_sale_units.find(u => u.is_default_unit && u.stock_quantity > 0) ||
    product_sale_units.find(u => u.stock_quantity > 0);

  // 🛒 Add to cart
  const handleAddToCart = () => {
    if (!defaultUnit || isOutOfStock) return;

    dispatch(
      addToCart({
        store,
        productId: id,
        unit: defaultUnit.unit_name,
        qty: 1
      })
    );
  };

  return (
    <div
      className={`relative bg-amber-100 w-72 min-w-72 border-2 border-black rounded-lg overflow-hidden
        shadow-emerald-100 shadow-[-5px_5px_0px_0px]
        hover:shadow-[-10px_10px_0px_0px] hover:shadow-emerald-300
        flex flex-col ml-10 mb-5 transition-all ease-in-out`}
    >
      {/* 🔴 Out of stock badge */}
      {isOutOfStock && (
        <span className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
          Out of Stock
        </span>
      )}

      {/* Product Image */}
      <Link href={`/product/${slug}`}>
        <div className="relative flex justify-center bg-white pt-4">
          {image_url ? (
            <>
              <img
                src={image_url}
                alt={name}
                className={`relative w-auto h-full sm:h-56 md:h-64 object-cover z-10 ${
                  isOutOfStock ? "opacity-50" : ""
                }`}
              />
            </>
          ) : (
            <div className="w-full h-56 md:h-64 bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-center bg-white flex-1">
        <h3 className="text-lg font-semibold">{name || "Unnamed Product"}</h3>
        {defaultUnit ? (
          <p className="text-gray-600 mt-1">
            ${defaultUnit.price.toFixed(2)} / {defaultUnit.unit_name}
          </p>
        ) : (
          <p className="text-red-600 text-sm mt-1">No available units</p>
        )}
      </div>

      {/* Add to Cart Button */}
      {/* <button
        disabled={isOutOfStock}
        onClick={handleAddToCart}
        className={`h-12 w-full font-bold flex items-center justify-center gap-2 transition-colors ${
          isOutOfStock
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-[#228B22] hover:bg-lime-300 text-white hover:text-black"
        }`}
      >
        <FaShoppingCart size={20} />
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button> */}
    </div>
  );
};

export default ProductCard;
