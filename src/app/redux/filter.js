import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selected: {},
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {

        // 1. Toggle a single subcategory
        toggleSubcategory : (state, action) => {
  const { parent, value } = action.payload; // value = ID
  if (!state.selected[parent]) state.selected[parent] = [];
  if (state.selected[parent].includes(value)) {
    state.selected[parent] = state.selected[parent].filter((v) => v !== value);
  } else {
    state.selected[parent].push(value);
  }
},

        // 2. Toggle ALL subcategories under a parent
        toggleParentCategory: (state, action) => {
            const { parent, subcatList } = action.payload;

            const alreadyAllSelected =
                state.selected[parent] &&
                state.selected[parent].length === subcatList.length;

            if (alreadyAllSelected) {
                delete state.selected[parent];
            } else {
                state.selected[parent] = [...new Set(subcatList)];
            }
        },

        // 3. Select ALL categories
        selectAllCategories: (state, action) => {
            const categories = action.payload;
            state.selected = {};

            categories.forEach(cat => {
                state.selected[cat.parentcat] = [...new Set(cat.subcat)];
            });
        },

        // 4. Clear everything
        clearCategories: (state) => {
            state.selected = {};
        }
    },
});

export const {
    toggleSubcategory,
    toggleParentCategory,
    selectAllCategories,
    clearCategories
} = filterSlice.actions;

export default filterSlice.reducer;
