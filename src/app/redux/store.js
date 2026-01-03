import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart";
import filterReducer from "./filter";
import searchReducer from "./search";



export const store = configureStore({
    reducer:{
        cart: cartReducer,
        filter: filterReducer,
        search: searchReducer
        //user: userReducer
    }
})