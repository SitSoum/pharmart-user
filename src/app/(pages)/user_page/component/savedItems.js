"use client";
// import { saved_products } from "@/app/statics_data/savedProduct";
import ProductCart from "@/components/product/productCard";

const SavedItems = ({ title }) => {
  return (
    <section className="flex flex-wrap gap-6 mt-10 mb-5 p-6 bg-white rounded-2xl shadow-lg border w-full border-green-700">
      {/* {saved_products.length === 0 ? (
        <p className="w-full text-center text-gray-500">
          No products saved in your cart.
        </p>
      ) : (
        saved_products.map((product, key) => (
          <ProductCart data={product} key={key} />
        ))
      )} */}
    </section>
  );
};

export default SavedItems;
