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

  // 🔥 Fetch categories from Supabase
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
        .order("name");

      if (!error && data) {
        const formatted = data.map((cat) => ({
          id: cat.id,
          parentcat: cat.name,
          subcat: cat.sub_categories.map((s) => ({
            id: s.id,
            name: s.name,
          })),
        }));

        setCategories(formatted);
      }
    };

    fetchCategories();
  }, []);

  //    useEffect(() => {
  //     console.log(selected)
  //   }, [selected]);

      useEffect(() => {
      console.log("is open",isOpen)
    }, [isOpen]);

  return (
    <section className="w-95 bg-white border-r border-gray-200 shadow-xl">
      <form className="filter-tab flex flex-col overflow-y-auto h-full px-6 py-8 no-scrollbar">
        {/* Nearest Location */}
        <div className="pb-4 border-b border-gray-200 mb-6">
          <FilterCheckBox
            parent={"nearest-location"}
            label="Nearest Location"
          />
        </div>

        <CollapsibleGroup
          title="Category"
          defaultOpen={true}
          className="overflow-y-auto"
        >
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="flex flex-col mt-4 ml-3 border-l-2 border-gray-200 pl-3 "
            >
              {/* Toggle */}
              <button
                type="button"
                onClick={() => toggleOpen(index)}
                className="flex justify-between items-center text-md font-bold text-gray-700 mb-2"
              >
                {cat.parentcat}
                <HiChevronDown
                  size={20}
                  className={`transition-transform ${
                    isOpen[index] ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {/* Parent checkbox (MAIN CATEGORY ID) */}
              <ParentCheckBox
                parent={cat.parentcat}
                value={cat.id}
                label={cat.parentcat}
                subcatList={cat.subcat.map((s) => s.id)}
              />

              {/* Sub-categories */}
              <div
                className={`transition-all ${
                  isOpen[index] ? "max-h-screen" : "max-h-0 overflow-hidden"
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

        {/* MEDICATION FORM CHECK GROUP */}
        <CollapsibleGroup title="Form of Medication:" defaultOpen={true}>
          <FilterCheckBox parent="Form" label="Capsule" />
          <FilterCheckBox parent="Form" label="Cream" />
          <FilterCheckBox parent="Form" label="Patch" />
          <FilterCheckBox parent="Form" label="Powder" />
          <FilterCheckBox parent="Form" label="Tablet" />
        </CollapsibleGroup>

        {/* TARGET USER CHECK GROUP */}
        <CollapsibleGroup title="For:" defaultOpen={true}>
          <FilterCheckBox parent="For" label="Infant" />
          <FilterCheckBox parent="For" label="Child" />
          <FilterCheckBox parent="For" label="Adult" />
          <FilterCheckBox parent="For" label="Senior" />
        </CollapsibleGroup>

        {/* PRICE RANGE (Placeholder) */}
        <div className="pt-6 border-t border-gray-200 mb-8">
          <label className="text-lg font-extrabold text-gray-800 mb-3 block">
            Price Range
          </label>
          <div className="h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {/* <Slider defaultValue={1} max={1000}/> */}
          </div>
        </div>

        {/* FILTER BUTTONS WRAPPER */}
        <div className="mt-auto flex space-x-2">
          {/* CLEAR FILTER BUTTON */}
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-1/2 px-3 py-3 text-lg font-extrabold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300"
          >
            Clear
          </button>
        </div>
      </form>
    </section>
  );
};

export default FilterBar;
