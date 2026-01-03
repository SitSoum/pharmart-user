import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CostumCheckBox from "@/components/product/checkBox";
import { toggleSubcategory } from "@/app/redux/filter";

const FilterCheckBox = ({ parent, value, label }) => {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.filter.selected);

  const isChecked =
    selected[parent] && selected[parent].includes(value); // <-- use value (ID)

    //  useEffect(() => {
    //     console.log(selected)
    //   }, [selected]);

    

  const handleToggle = () => {
    dispatch(toggleSubcategory({ parent, value })); // <-- store ID
  };

  return (
    <CostumCheckBox
      label={label}
      id={`${parent}-${value}`}
      checked={!!isChecked}
      onChange={handleToggle}
    />
  );
};

export default FilterCheckBox;
