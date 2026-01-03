"use client";
import Link from "next/link";

import ProductCart from "@/components/product/productCard";
import { EmblaCarousel } from "@/components/home/homeSlider/carousel";
import { CategoryCard } from "@/components/product/categoryCard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "@/app/supabase";

// import "/assets/health-vulnerability_through_social_determinants-24px.svg" as health_social_icon;




export default function Home() {
  const statusTab = useSelector((store) => store.cart.statusTab);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);



  useEffect(() => {
  const fetchFeaturedProducts = async () => {
    setLoadingFeatured(true);

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        image_url,
        product_sale_units (
          id,
          unit_name,
          price,
          is_default_unit,
          stock_quantity
        )
      `)
      .eq("visible", true)
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if(error){
      console.log(error)
    }
    if (!error && data) {
      setFeaturedProducts(data);
    }


    setLoadingFeatured(false);
  };

  fetchFeaturedProducts();
}, []);


  return (
<div className="w-full flex flex-col bg-gray-50">
  {/* Hero Section */}
  <div className="relative min-h-screen bg-cover bg-center">
    <img
          src="https://images.pexels.com/photos/5910953/pexels-photo-5910953.jpeg" // or dynamic image variable
          alt="Background"
          className="absolute w-full h-full object-cover z-0 blur-sm brightness-75"/>
    <div className="absolute inset-0 bg-linear-to-r from-green-700/60 via-green-500/30 to-transparent"></div>

    <div className="relative z-10 flex flex-col justify-center items-start h-screen p-8 md:p-20">
      <p className="mb-4 text-white text-sm font-semibold flex items-center bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full">
        <span className="mr-2 border rounded-full bg-green-300 p-1">
          <img src="/assets/health-vulnerability_through_social_determinants-24px.svg" alt="icon" className="w-5 h-5"/>
        </span>
        Convenience & Trust
      </p>

      <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl">
        Shop{" "}
        <span className="text-green-400/90">
          medicines, wellness products, and health essentials
        </span>{" "}
        from verified pharmacies.
      </h1>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/products"
          className="px-6 py-3 text-white font-semibold rounded-lg transition duration-300 bg-green-600 hover:bg-green-700 shadow-lg"
        >
          Shop Now
        </Link>

        <Link
          href="/user_page"
          className="px-6 py-3 text-white font-semibold rounded-lg transition duration-300 bg-[#374151] backdrop-blur-md border border-green-300 hover:bg-white/30"
        >
          Track Orders
        </Link>
      </div>
    </div>
  </div>

  {/* Featured Products Section */}
  <div className={`max-w-full m-auto mt-16 py-5 px-5 flex flex-col justify-center transform transition-transform duration-500 ${statusTab ? "-translate-x-46" : ""}`}>
    <div className="w-full h-150 relative border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
      <div className="absolute w-full h-full object-cover z-0 bg-green-50" />
      {/* Optional carousel placeholder */}
      <div className="relative z-10 flex w-full h-full justify-center items-center">
        <EmblaCarousel/>
      </div>
    </div>

    <h2 className="text-3xl font-bold mt-10 mb-5 border-l-4 border-green-500 pl-4">
      Featured Products
    </h2>

    <div className="flex flex-wrap gap-6 py-5">
      {loadingFeatured ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        featuredProducts.map((product, key) => (
          <ProductCart data={product} key={key} />
        ))
      )}
    </div>
  </div>
</div>

  );
}
