import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTartget } from "@/app/redux/search";
import { useEffect } from "react";



const SearchDropDown = () => {
  const dispatch = useDispatch();
  const selectedGTarget = useSelector(
    (store) => store.search.selectedGTarget
  );

  const handleChange = (value) => {
    dispatch(setSelectedTartget(value));
  };

  return (
    <Select value={selectedGTarget} onValueChange={handleChange}>
      <SelectTrigger
        className="
          h-full px-3 sm:px-4
          bg-transparent
          text-white font-semibold text-sm sm:text-base
          border-0
          focus:ring-0
          flex items-center gap-1
        "
      >
        <SelectValue placeholder="Items" />
      </SelectTrigger>

      <SelectContent
        className="
          z-[600]
          bg-green-900/95
          backdrop-blur-md
          border border-white/10
          rounded-xl
          shadow-xl
          text-white
        "
      >
        <SelectItem
          value="item"
          className="
            cursor-pointer
            focus:bg-lime-400/20
            focus:text-lime-300
          "
        >
          Items
        </SelectItem>

        <SelectItem
          value="store"
          className="
            cursor-pointer
            focus:bg-lime-400/20
            focus:text-lime-300
          "
        >
          Store
        </SelectItem>
      </SelectContent>
    </Select>
  );
};


export default SearchDropDown;