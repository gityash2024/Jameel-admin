import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { subcategoryAPI } from '../../services/api';

export const fetchSubCategories = createAsyncThunk(
  'subcategory/fetchSubCategories',
  async () => {
    const response = await subcategoryAPI.getAllSubCategories();
    return response.data || [];
  }
);

export const createSubCategory = createAsyncThunk(
  'subcategory/createSubCategory',
  async (subcategoryData) => {
    const response = await subcategoryAPI.createSubCategory(subcategoryData);
    return response.data;
  }
);


export const fetchSubcategoriesByCategory = createAsyncThunk(
  'subcategory/fetchByCategory',
  async (categoryId) => {
    const response = await subcategoryAPI.getSubCategoriesByCategory(categoryId);
    return response.data || [];
  }
);


export const updateSubCategory = createAsyncThunk(
  'subcategory/updateSubCategory',
  async ({ id, subcategoryData }) => {
    const response = await subcategoryAPI.updateSubCategory(id, subcategoryData);
    return response.data;
  }
);

export const deleteSubCategory = createAsyncThunk(
  'subcategory/deleteSubCategory',
  async (id) => {
    await subcategoryAPI.deleteSubCategory(id);
    return id;
  }
);

export const updateSubCategoryStatus = createAsyncThunk(
  'subcategory/updateStatus',
  async ({ id, status }) => {
    const response = await subcategoryAPI.updateSubCategoryStatus(id, status);
    return { id, status, data: response.data };
  }
);

const subcategorySlice = createSlice({
  name: 'subcategory',
  initialState: {
    subcategories: [],
    loading: false,
    error: null,
    selectedSubCategory: null
  },
  reducers: {
    setSelectedSubCategory: (state, action) => {
      state.selectedSubCategory = action.payload;
    },
    clearSelectedSubCategory: (state) => {
      state.selectedSubCategory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload.data;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Add in the extraReducers section:
  .addCase(fetchSubcategoriesByCategory.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchSubcategoriesByCategory.fulfilled, (state, action) => {
    state.loading = false;
    state.subcategories = action.payload.data;
  })
  .addCase(fetchSubcategoriesByCategory.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
  })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state?.subcategories?.unshift(action.payload.data);
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subcategories.findIndex(
          (subcategory) => subcategory?._id === action.payload.data.subcategory?._id
        );
        if (index !== -1) {
          state.subcategories[index] = action.payload.data.subcategory;
        }
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = state.subcategories.filter(
          (subcategory) => subcategory._id !== action.payload
        );
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSubCategoryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubCategoryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subcategories.findIndex(
          (subcategory) => subcategory._id === action.payload.id
        );
        if (index !== -1) {
          state.subcategories[index].isActive = action.payload.status;
        }
      })
      .addCase(updateSubCategoryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSelectedSubCategory, clearSelectedSubCategory } = subcategorySlice.actions;
export default subcategorySlice.reducer;