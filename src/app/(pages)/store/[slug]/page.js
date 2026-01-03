"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/product/productCard";
import { DropDownCheckMenu } from "@/components/product/dropDownCheckMenu";
import { useParams } from "next/navigation";
import { supabase } from "@/app/supabase";

const StorePage = () => {
  const { slug } = useParams(); // lainglaing
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chosenChoice, setChoice] = useState(null);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchStore = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("stores")
        .select(
          `
        id,
        name,
        logo_url,
        address,
        validated,
        phone_number,
        start_time,
        close_time
      `
        )
        .eq("slug", slug)
        .single(); // ✅ prevents 406

      if (error) {
        console.error("Failed to fetch store:", error);
        setLoading(false);
        return;
      }

      setStore(data);
      setLoading(false);
    };

    fetchStore();
  }, [slug]);

  useEffect(() => {
    if (!store?.id) return; // ⛔ wait for store

    const fetchProducts = async () => {
      setProductsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select(
          `
    id,
    name,
    slug,
    image_url,
    description,
    product_sale_units (
      unit_name,
      price,
      is_default_unit,
      stock_quantity
    )
  `
        )
        .eq("store_id", store.id);

      if (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } else {
        setProducts(
          (data || []).map((p) => ({
            ...p,
            sale_units: p.product_sale_units.map((u) => ({
              unit: u.unit_name,
              price: u.price,
              stock: u.stock_quantity,
              is_default: u.is_default_unit,
            })),
          }))
        );
      }

      setProductsLoading(false);
    };

    fetchProducts();
  }, [store?.id]);

  if (loading) {
    return (
      <div className="p-30 text-center text-gray-500 text-lg w-screen h-screen">
        Loading store...
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-white w-full mt-20">
      {/* --- Store Banner --- */}
      <img
        src="/assets/pharmat_logo.png"
        alt="Store Banner"
        className="w-full h-56 object-cover rounded-xl shadow-md"
      />

      {/* --- Store Info & Navigation --- */}
      <div className="store-nav-bar flex flex-col lg:flex-row justify-between items-center border-2 border-green-700 rounded-lg mt-5 p-4 lg:p-6 gap-4">
        {/* Store Picture & Name */}
        <div className="store-pic-name flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-green-700">
            <img
              src={store?.logo_url || "/assets/cat_profile.png"}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-2xl text-gray-900">
            {store?.name || "Loading..."}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-wrap justify-center items-center gap-4 text-sm font-bold uppercase text-gray-800">
          <ul>
            <li className="hover:text-green-700 cursor-pointer transition">
              About
            </li>
          </ul>
          <ul>
            <li>
              <DropDownCheckMenu
                menuName="Area of Usage"
                choices={[
                  "Hair",
                  "Eye",
                  "Skin",
                  "Nasal",
                  "Tooth",
                  "Hand",
                  "Foot",
                ]}
                chosenChoice={chosenChoice}
                setChoice={setChoice}
              />
            </li>
          </ul>
          <ul>
            <li>
              <DropDownCheckMenu
                menuName="Minor Illness"
                choices={["Colds", "Headaches", "Allergies"]}
                chosenChoice={chosenChoice}
                setChoice={setChoice}
              />
            </li>
          </ul>
          <ul>
            <li>
              <DropDownCheckMenu
                menuName="Health Products"
                choices={[
                  "Vitamins",
                  "Supplements",
                  "Medical Devices",
                  "Hygiene",
                ]}
                chosenChoice={chosenChoice}
                setChoice={setChoice}
              />
            </li>
          </ul>
        </nav>
      </div>

      {/* --- Store Details --- */}
      <section className="flex flex-col md:flex-row gap-8 border border-gray-300 rounded-xl mt-8 p-6 shadow-md bg-green-50">
        <div>
          <span className="text-gray-700 font-bold underline">Open Hour: </span>
          <div className="text-gray-800 mt-1">
            {store?.start_time} - {store?.close_time}
          </div>
        </div>
        <div>
          <span className="text-gray-700 font-bold underline">Location: </span>
          <p className="text-gray-800 mt-1">{store?.address}</p>
        </div>
        <div>
          <span className="text-gray-700 font-bold underline">Contacts: </span>
          <div className="text-gray-800 mt-1">Phone: {store?.phone_number}</div>
          <div className="text-gray-800 mt-1">Telegram: </div>
          <div className="text-gray-800 mt-1">FB: </div>
        </div>
      </section>

      {/* --- Products Section --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border border-gray-300 rounded-xl mt-8 p-6 shadow-lg bg-white">
        {productsLoading && (
          <p className="col-span-full text-center text-gray-500">
            Loading products...
          </p>
        )}

        {!productsLoading && products.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No products available
          </p>
        )}

        {products.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </section>
    </div>
  );
};

export default StorePage;
