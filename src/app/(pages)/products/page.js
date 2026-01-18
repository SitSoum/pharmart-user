"use client"
import { useState } from "react";
import FilterBar from "./components/filterBar";
import FilterdProducts from "./components/filterdProducts";
import { FaFilter } from "react-icons/fa";

const ProductsPage = () => {
  const [numResult, setNumResult] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div
      className="
        page
        w-full
        min-h-screen
        mt-24 sm:mt-26.25
        flex flex-row
        gap-6
        px-3 sm:px-5
        relative
      "
    >
      {/* ================= MOBILE FILTER BUTTON ================= */}
      <button
        onClick={() => setShowFilter(true)}
        className="
          lg:hidden
          fixed bottom-6 right-6 z-40
          bg-green-600 text-white
          px-5 py-3 rounded-full
          shadow-lg
          flex items-center gap-2
        "
      >
        <FaFilter />
        Filter
      </button>

      {/* ================= FILTER BAR ================= */}
      {/* Desktop */}
      <aside
        className="
          hidden lg:block
          w-72 shrink-0
          bg-white
          rounded-xl
          shadow-sm
          border border-gray-200
        "
      >
        <FilterBar />
      </aside>

      {/* Mobile Drawer */}
      {showFilter && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden pt-20"
            onClick={() => setShowFilter(false)}
          />

          {/* Drawer */}
          <aside
            className="
              fixed top-0 left-0 h-full w-72
              bg-white z-50
              shadow-xl
              border-r
              p-4
              lg:hidden
            "
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Filters</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <FilterBar />
          </aside>
        </>
      )}

      {/* ================= PRODUCT SECTION ================= */}
      <main className="flex-1 flex flex-col w-full pt-20">
        {/* RESULT COUNT */}
        <div className="px-2 sm:px-6 pt-2 pb-4">
          <h2
            className="
              text-xl sm:text-2xl
              font-extrabold
              text-lime-500
              text-left
            "
          >
            {numResult ?? 0} Results
          </h2>
        </div>

        {/* PRODUCT GRID */}
        <FilterdProducts setNumResult={setNumResult} />
      </main>
    </div>
  );
};

export default ProductsPage;
