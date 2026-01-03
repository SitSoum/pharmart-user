
// import { useRouter } from "next/navigation";
import { useDispatch,useSelector } from "react-redux";
import { setSearchParam } from "@/app/redux/search";
import { FaSearch } from "react-icons/fa";
import { ArrowRightFromLineIcon } from "lucide-react";
import SearchDropDown from "./searchDropDown";
import { useRouter } from 'nextjs-toploader/app'

export const SearchBar = () => {
  const router = useRouter();
  const searchParam = useSelector((store) => store.search.searchParam);
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (!searchParam?.trim()) return;
    router.push(`/products/${searchParam}`);
  };

  return (
    <div
      className="
        flex items-center w-full h-10 sm:h-12
        rounded-full
        bg-white/15 backdrop-blur-md
        border border-white/20
        shadow-md
        overflow-hidden
        transition
        focus-within:border-lime-300
      "
    >
      {/* CATEGORY DROPDOWN */}
      <div className="h-full px-2 sm:px-3 flex items-center border-r border-white/20 cursor-pointer">
        <SearchDropDown />
      </div>

      {/* SEARCH ICON */}
      <FaSearch
        size={14}
        className="text-white/80 ml-3 sm:ml-4 flex-shrink-0"
      />

      {/* INPUT */}
      <input
        type="text"
        placeholder="Search products..."
        className="
          bg-transparent flex-1 ml-2
          text-white text-sm sm:text-base
          placeholder:text-white/60
          outline-none
        "
        onChange={(e) => dispatch(setSearchParam(e.target.value))}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        className="
          h-full px-4 sm:px-5
          flex items-center justify-center
          bg-lime-400 hover:bg-lime-500
          text-green-900
          transition
        "
      >
        <ArrowRightFromLineIcon size={18} />
      </button>
    </div>
  );
};
