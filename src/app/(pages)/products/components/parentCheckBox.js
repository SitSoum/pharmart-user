import { useDispatch, useSelector } from "react-redux";
import CostumCheckBox from "@/components/product/checkBox";
import { toggleParentCategory } from "@/app/redux/filter";

const ParentCheckBox = ({ parent, subcatList }) => {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.filter.selected);

  // Check if all subcat IDs are selected
  const allSelected =
    selected[parent] &&
    subcatList.every((id) => selected[parent].includes(id));

  const handleToggleAll = () => {
    dispatch(toggleParentCategory({ parent, subcatList })); // store IDs
  };

  return (
    <CostumCheckBox
      label={`${parent} - All`}
      id={`${parent}-all`}
      checked={allSelected}
      onChange={handleToggleAll}
    />
  );
};

export default ParentCheckBox;
