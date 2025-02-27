import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storeAPI } from '../../services/api';

export const fetchStores = createAsyncThunk(
  'store/fetchStores',
  async () => {
    const response = await storeAPI.getAllStores();
    return response.data || [];
  }
);

export const fetchNearbyStores = createAsyncThunk(
  'store/fetchNearbyStores',
  async ({ lat, lng, distance }) => {
    const response = await storeAPI.findNearbyStores(lat, lng, distance);
    return response.data || [];
  }
);

export const createStore = createAsyncThunk(
  'store/createStore',
  async (storeData) => {
    const response = await storeAPI.createStore(storeData);
    return response.data;
  }
);

export const updateStore = createAsyncThunk(
  'store/updateStore',
  async ({ id, storeData }) => {
    const response = await storeAPI.updateStore(id, storeData);
    return response.data;
  }
);

export const deleteStore = createAsyncThunk(
  'store/deleteStore',
  async (id) => {
    await storeAPI.deleteStore(id);
    return id;
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState: {
    stores: [],
    nearbyStores: [],
    loading: false,
    error: null,
    selectedStore: null
  },
  reducers: {
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },
    clearSelectedStore: (state) => {
      state.selectedStore = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.data;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchNearbyStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyStores.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyStores = action.payload.data;
      })
      .addCase(fetchNearbyStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores.unshift(action.payload.data.store);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.stores.findIndex(
          (store) => store._id === action.payload.data.store._id
        );
        if (index !== -1) {
          state.stores[index] = action.payload.data.store;
        }
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = state.stores.filter(
          (store) => store._id !== action.payload
        );
      })
      .addCase(deleteStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSelectedStore, clearSelectedStore } = storeSlice.actions;
export default storeSlice.reducer;