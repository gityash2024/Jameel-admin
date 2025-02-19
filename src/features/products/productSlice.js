// src/features/products/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../../services/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params) => {
    const response = await productAPI.getAllProducts(params);
    return response.data;
  }
);

export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id) => {
    const response = await productAPI.getProduct(id);
    return response.data;
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

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id) => {
    await productAPI.deleteProduct(id);
    return id;
  }
);

export const createVariant = createAsyncThunk(
  'product/createVariant',
  async ({ productId, variantData }) => {
    const response = await productAPI.createVariant(productId, variantData);
    return response.data;
  }
);

export const updateVariant = createAsyncThunk(
  'product/updateVariant',
  async ({ productId, variantId, variantData }) => {
    const response = await productAPI.updateVariant(productId, variantId, variantData);
    return response.data;
  }
);

export const deleteVariant = createAsyncThunk(
  'product/deleteVariant',
  async ({ productId, variantId }) => {
    await productAPI.deleteVariant(productId, variantId);
    return { productId, variantId };
  }
);

export const bulkDeleteProducts = createAsyncThunk(
  'product/bulkDelete',
  async (ids) => {
    await productAPI.bulkDeleteProducts(ids);
    return ids;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    product: null,
    total: 0,
    loading: false,
    error: null,
    filters: {
      search: '',
      category: '',
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
        minPrice: '',
        maxPrice: '',
        sort: '',
        page: 1,
        limit: 10
      };
    },
    clearProduct: (state) => {
      state.product = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
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

      // Fetch Single Product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data.product;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload.data.product);
        state.total += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload.data.product._id
        );
        if (index !== -1) {
          state.products[index] = action.payload.data.product;
        }
        if (state.product?._id === action.payload.data.product._id) {
          state.product = action.payload.data.product;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.total -= 1;
        if (state.product?._id === action.payload) {
          state.product = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Bulk Delete Products
      .addCase(bulkDeleteProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => !action.payload.includes(product._id)
        );
        state.total -= action.payload.length;
      })
      .addCase(bulkDeleteProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Variant Operations
      .addCase(createVariant.fulfilled, (state, action) => {
        if (state.product?._id === action.payload.data.variant.product) {
          state.product.variants.push(action.payload.data.variant);
        }
      })
      .addCase(updateVariant.fulfilled, (state, action) => {
        if (state.product?._id === action.payload.data.variant.product) {
          const index = state.product.variants.findIndex(
            (variant) => variant._id === action.payload.data.variant._id
          );
          if (index !== -1) {
            state.product.variants[index] = action.payload.data.variant;
          }
        }
      })
      .addCase(deleteVariant.fulfilled, (state, action) => {
        if (state.product?._id === action.payload.productId) {
          state.product.variants = state.product.variants.filter(
            (variant) => variant._id !== action.payload.variantId
          );
        }
      });
  }
});

export const { setFilters, resetFilters, clearProduct } = productSlice.actions;
export default productSlice.reducer;