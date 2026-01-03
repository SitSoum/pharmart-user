import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    selectedGTarget: "item",
    searchParam: ""
  },
  reducers: {
    setSelectedTartget: (state, action) => {
      state.selectedGTarget = action.payload;
    },

    setSearchParam: (state, action) => {
      state.searchParam = action.payload;
    }
  }
});

export const { setSelectedTartget,setSearchParam} = searchSlice.actions;
export default searchSlice.reducer;