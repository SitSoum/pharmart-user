"use client";

import { CollapsibleGroup } from "./collapsibleGroup";
import { useState, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { clearCategories } from "@/app/redux/filter";
import FilterCheckBox from "./filterCheckBox";
import ParentCheckBox from "./parentCheckBox";
import { supabase } from "@/app/supabase";

const FilterBar = () => {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.filter.selected);

  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState({});

  const toggleOpen = (i) => {
    setIsOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const handleClearFilters = () => {
    dispatch(clearCategories());
  };

  // Fetch categories
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
        `,
        )
        .order("name");

      if (!error && data) {
        setCategories(
          data.map((cat) => ({
            id: cat.id,
            parentcat: cat.name,
            subcat: cat.sub_categories.map((s) => ({
              id: s.id,
              name: s.name,
            })),
          })),
        );
      }
    };

    fetchCategories();
  }, []);

  return (
    <section
      className="
        h-full
        w-full
        lg:w-72
        bg-white
        shadow-xl
        border-gray-200
        lg:border-r
        pt-20
      "
    >
      <form
        className="
          flex flex-col
          h-full
          overflow-y-auto
          px-5 py-6
          no-scrollbar
        "
      >
        <div className=" pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClearFilters}
            className="
      w-full
      py-3
      text-sm font-semibold
      rounded-xl
      border border-gray-300
      bg-white
      text-gray-700
      hover:border-lime-500
      hover:text-lime-600
      hover:bg-lime-50
      transition
      duration-200
    "
          >
            Clear all filters
          </button>
        </div>

        {/* ================= Nearest Location ================= */}
        <div className="pb-4 border-b border-gray-200 mt-6 mb-6">
          <FilterCheckBox parent="nearest-location" label="Nearest Location" />
        </div>

        {/* ================= CATEGORY ================= */}
        <CollapsibleGroup title="Category" defaultOpen={true}>
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="
                flex flex-col
                mt-4 ml-2
                border-l-2 border-gray-200
                pl-3
              "
            >
              {/* Toggle */}
              <button
                type="button"
                onClick={() => toggleOpen(index)}
                className="
                  flex justify-between items-center
                  text-sm font-bold text-gray-700
                  mb-2
                "
              >
                {cat.parentcat}
                <HiChevronDown
                  size={18}
                  className={`transition-transform ${
                    isOpen[index] ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              {/* Parent checkbox */}
              <ParentCheckBox
                parent={cat.parentcat}
                value={cat.id}
                label={cat.parentcat}
                subcatList={cat.subcat.map((s) => s.id)}
              />

              {/* Sub categories */}
              <div
                className={`transition-all ${
                  isOpen[index]
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {cat.subcat.map((sub) => (
                  <FilterCheckBox
                    key={sub.id}
                    parent={cat.parentcat}
                    value={sub.id}
                    label={sub.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </CollapsibleGroup>

        {/* ================= FORM ================= */}
        <CollapsibleGroup title="Form of Medication:" defaultOpen>
          {["Capsule", "Cream", "Patch", "Powder", "Tablet"].map((f) => (
            <FilterCheckBox key={f} parent="Form" label={f} />
          ))}
        </CollapsibleGroup>

        {/* ================= TARGET USER ================= */}
        <CollapsibleGroup title="For:" defaultOpen>
          {["Infant", "Child", "Adult", "Senior"].map((t) => (
            <FilterCheckBox key={t} parent="For" label={t} />
          ))}
        </CollapsibleGroup>

        {/* ================= PRICE RANGE ================= */}
        <div className="pt-6 border-t border-gray-200 mb-8">
          <label className="text-base font-extrabold text-gray-800 mb-3 block">
            Price Range
          </label>
          <div className="h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {/* Slider placeholder */}
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
      </form>
    </section>
  );
};
export default FilterBar;
