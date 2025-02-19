import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mediaAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

export const fetchMedia = createAsyncThunk(
  'media/fetchMedia',
  async (params, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.getAllMedia(params);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch media');
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadMedia = createAsyncThunk(
  'media/uploadMedia',
  async (mediaData, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.uploadMedia(mediaData);
      toast.success('Media uploaded successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to upload media');
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMedia = createAsyncThunk(
  'media/updateMedia',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await mediaAPI.updateMedia(id, data);
      toast.success('Media updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update media');
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async (id, { rejectWithValue }) => {
    try {
      await mediaAPI.deleteMedia(id);
      toast.success('Media deleted successfully');
      return id;
    } catch (error) {
      toast.error('Failed to delete media');
      return rejectWithValue(error.response.data);
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    media: [],
    loading: false,
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.media = action.payload.data.media;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.media.unshift(action.payload.data.media);
        state.total += 1;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.media = state.media.filter(item => item._id !== action.payload);
        state.total -= 1;
      });
  }
});

export default mediaSlice.reducer;