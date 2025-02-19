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

export const updateProductStatus = createAsyncThunk(
  'product/updateStatus',
  async ({ id, status }) => {
    const response = await productAPI.updateProductStatus(id, status);
    return { id, status, data: response.data };
  }
);

export const bulkDeleteProducts = createAsyncThunk(
  'product/bulkDelete',
  async (ids) => {
    await productAPI.bulkDeleteProducts(ids);
    return { ids };
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    selectedProduct: null,
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
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
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
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

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
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload.id
        );
        if (index !== -1) {
          state.products[index].isActive = action.payload.status;
        }
      })

      .addCase(bulkDeleteProducts.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => !action.payload.ids.includes(product._id)
        );
        state.total -= action.payload.ids.length;
      });
  }
});

export const { 
  setFilters, 
  resetFilters, 
  setSelectedProduct, 
  clearSelectedProduct 
} = productSlice.actions;

export default productSlice.reducer;