import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartDataAPI, clearCartAPI, addCartAPI, decreaseCartAPI, removeItemCartAPI } from '../services/allAPI'

const getHeader = () => {
    const token = sessionStorage.getItem("Token");
    return {
        Authorization: `Bearer ${token}`,
    }
}

export const fetchCart = createAsyncThunk(
    "cart/get",
    async () => {
        const res = await getCartDataAPI(getHeader());
        console.log(res);
        return res
    }
)
export const addToCart = createAsyncThunk(
    "cart/add",
    async ({ productId, size }, { dispatch }) => {
        try {

            await addCartAPI({ productId, size }, getHeader());

            const res = await getCartDataAPI(getHeader());
            return res;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );

        }
    }
);

export const decreaseCart = createAsyncThunk(
    "cart/decrease",
    async ({ productId, size }) => {
        try {
            await decreaseCartAPI({ productId, size }, getHeader())
            const res = await getCartDataAPI(getHeader());
            return res;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Something went wrong" }
            );
        }
    }
)

export const removeFromCart = createAsyncThunk(
    "cart/remove",
    async ({ productId, size }) => {
        const res = await removeItemCartAPI(
            { productId, size },
            getHeader()
        );
        return { productId, size };
    }
);


export const clearCart = createAsyncThunk(
    "cart/clear",
    async () => {
        await clearCartAPI(getHeader());
        return res;
    }
);





const cartSlice = createSlice({
    name: "Cart",
    initialState: {
        items: [],
        total: 0,
        error: null
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action?.payload?.items || [];
                state.total = action?.payload.total || 0;
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                if (!action.payload) return;
                state.items = action.payload.items || [];
                state.total = action.payload.total || 0;
            })

            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload?.message || "Add to cart failed";
            })

            .addCase(decreaseCart.fulfilled, (state, action) => {
                if (!action.payload) return;
                state.items = action.payload.items || [];
                state.total = action.payload.total || 0;
            })

            .addCase(decreaseCart.rejected, (state, action) => {
                state.error = action.payload?.message || "Update failed";
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const { productId, size } = action.payload;

                state.items = state.items.filter(
                    (item) =>
                        !(item.productId === productId && item.size === size)
                );
            })


            .addCase(clearCart.pending, (state) => {
                state.items = [];
                state.total = 0;
            });
    }



})


export default cartSlice.reducer;