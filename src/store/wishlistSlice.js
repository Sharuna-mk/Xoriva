import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    addToWishlistAPI,
    getWishlistDataAPI,
    removeFromWishlistAPI,
} from "../services/allAPI";

const token = sessionStorage.getItem('Token')

export const fetchWishlist = createAsyncThunk(
    "wishlist/get",
    async () => {

        const reqHeader = {
            Authorization: `Bearer ${token}`
        }
        const res = await getWishlistDataAPI(reqHeader);
        console.log(res);
        return res
    }
);

export const addToWishList = createAsyncThunk(
    "wishlist/add",
    async ({ id }) => {

        const reqHeader = {
            Authorization: `Bearer ${token}`
        }
        const res = await addToWishlistAPI(id, reqHeader);
        console.log("API RESPONSE:", res);
        return res
    }
);




export const removeFromWishList = createAsyncThunk(
    "wishlist/remove",
    async ({ id }) => {

        const reqHeader = {
            Authorization: `Bearer ${token}`
        }
        await removeFromWishlistAPI(id, reqHeader);
        const res = await getWishlistDataAPI(reqHeader);
        console.log(res);

        return res;
    }
);



const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchWishlist.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {
                    state.items = [];
                }
            })

            .addCase(addToWishList.fulfilled, (state, action) => {
                const newItem = action.payload?.wishlist;

                if (!newItem || !newItem.product) return;

                if (!Array.isArray(state.items)) {
                    state.items = [];
                }

                const exists = state.items.some(
                    (item) => item?.product?._id === newItem.product._id
                );

                if (!exists) {
                    state.items.unshift(newItem);
                }
            })
            .addCase(removeFromWishList.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                }
            })
    },
});

export default wishlistSlice.reducer;