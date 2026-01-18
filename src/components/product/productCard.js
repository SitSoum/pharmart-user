"use client";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/redux/cart";

const ProductCard = ({ data }) => {
  const dispatch = useDispatch();
  const { id, name, image_url, product_sale_units = [], slug, store } = data;

  const isOutOfStock =
    product_sale_units.length === 0 ||
    product_sale_units.every((u) => u.stock_quantity <= 0);

  const defaultUnit =
    product_sale_units.find((u) => u.is_default_unit && u.stock_quantity > 0) ||
    product_sale_units.find((u) => u.stock_quantity > 0);

  const handleAddToCart = () => {
    if (!defaultUnit || isOutOfStock) return;

    dispatch(
      addToCart({
        store,
        productId: id,
        unit: defaultUnit.unit_name,
        qty: 1,
      })
    );
  };

  return (
    <div
      className={`relative bg-amber-100 border-2 border-black rounded-lg overflow-hidden
        shadow-emerald-100 shadow-[-5px_5px_0px_0px]
        hover:shadow-[-10px_10px_0px_0px] hover:shadow-emerald-300
        flex flex-col w-full max-w-sm mx-auto transition-all ease-in-out`}
    >
      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <span className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
          Out of Stock
        </span>
      )}

      {/* Product Image */}
      <div className="relative w-full h-56 sm:h-64 bg-white flex items-center justify-center">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            fill
            className={`object-contain ${isOutOfStock ? "opacity-50" : ""}`}
            sizes="(max-width: 640px) 100vw, 256px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 bg-white">
        <h3
          className="text-lg font-semibold line-clamp-2"
          title={name}
        >
          {name || "Unnamed Product"}
        </h3>

        {defaultUnit ? (
          <p className="text-gray-600 mt-1">
            ${defaultUnit.price.toFixed(2)} / {defaultUnit.unit_name}
          </p>
        ) : (
          <p className="text-red-600 text-sm mt-1">No available units</p>
        )}
      </div>

      {/* View Product / Add to Cart */}
      <Link
        href={`/product/${slug}`}
        className={`h-12 w-full font-bold flex items-center justify-center gap-2 transition-colors
          ${
            isOutOfStock
              ? "bg-gray-400 pointer-events-none text-white"
              : "bg-green-700 hover:bg-lime-400 text-white hover:text-black"
          }`}
      >
        <FaShoppingCart size={20} />
        {isOutOfStock ? "Out of Stock" : "View Product"}
      </Link>
    </div>
  );
};

export default ProductCard;
