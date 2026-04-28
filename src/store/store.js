import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from './wishlistSlice'
import cartReducer from './cartSlice'
import searchReducer from './searchSlice'

export const wishlistStore = configureStore({
    reducer:{
       wishlist : wishlistReducer,
       cart: cartReducer,
       search: searchReducer
    }
})