// In your productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params) => {
    const response = await productAPI.getAllProducts(params);
    return response.data;
  }
);

export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`[productSlice] Fetching product with ID: ${id}`);
      const response = await productAPI.getProduct(id);
      console.log(`[productSlice] Product fetch successful:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`[productSlice] Error fetching product:`, error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Failed to fetch product'
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData) => {
    const response = await productAPI.createProduct(productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, productData }) => {
    const response = await productAPI.updateProduct(id, productData);
    return response.data;
  }
);

export const updateProductStatus = createAsyncThunk(
  'product/updateStatus',
  async ({ id, status }) => {
    const response = await productAPI.updateProduct(id, { isActive: status });
    return { id, status, data: response.data.product };
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id) => {
    await productAPI.deleteProduct(id);
    return id;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    total: 0,
    filters: {
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sort: '',
      page: 1,
      limit: 10
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        sort: '',
        page: 1,
        limit: 10
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data.product;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload.id
        );
        if (index !== -1) {
          state.products[index].isActive = action.payload.status;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.total -= 1;
      });
  }
});

export const { setFilters, resetFilters } = productSlice.actions;

export default productSlice.reducer;