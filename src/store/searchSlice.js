import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchProductAPI } from "../services/allAPI";

export const searchProducts = createAsyncThunk(
  "search/searchProducts",
  async (query, { rejectWithValue }) => {
    try {
      const res = await searchProductAPI(query);
       return Array.isArray(res.data) ? res.data : res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    loading: false,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;