// src/features/tags/tagSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tagAPI } from '../../services/api';

export const fetchTags = createAsyncThunk(
  'tag/fetchTags',
  async () => {
    const response = await tagAPI.getAllTags();
    return response.data;
  }
);

export const createTag = createAsyncThunk(
  'tag/createTag',
  async (tagData) => {
    const response = await tagAPI.createTag(tagData);
    return response.data;
  }
);

export const updateTag = createAsyncThunk(
  'tag/updateTag',
  async ({ id, tagData }) => {
    const response = await tagAPI.updateTag(id, tagData);
    return response.data;
  }
);

export const deleteTag = createAsyncThunk(
  'tag/deleteTag',
  async (id) => {
    await tagAPI.deleteTag(id);
    return id;
  }
);

export const updateTagStatus = createAsyncThunk(
  'tag/updateStatus',
  async ({ id, status }) => {
    const response = await tagAPI.updateTagStatus(id, status);
    return { id, status, data: response.data };
  }
);

export const bulkDeleteTags = createAsyncThunk(
  'tag/bulkDelete',
  async (ids) => {
    await tagAPI.bulkDeleteTags(ids);
    return ids;
  }
);

const tagSlice = createSlice({
  name: 'tag',
  initialState: {
    tags: [],
    loading: false,
    error: null,
    selectedTag: null
  },
  reducers: {
    setSelectedTag: (state, action) => {
      state.selectedTag = action.payload;
    },
    clearSelectedTag: (state) => {
      state.selectedTag = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tags
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.data.tags;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Tag
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags.unshift(action.payload.data.tag);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Tag
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tags.findIndex(
          (tag) => tag._id === action.payload.data.tag._id
        );
        if (index !== -1) {
          state.tags[index] = action.payload.data.tag;
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Tag
      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter(
          (tag) => tag._id !== action.payload
        );
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Tag Status
      .addCase(updateTagStatus.fulfilled, (state, action) => {
        const index = state.tags.findIndex(
          (tag) => tag._id === action.payload.id
        );
        if (index !== -1) {
          state.tags[index].isActive = action.payload.status;
        }
      })

      // Bulk Delete Tags
      .addCase(bulkDeleteTags.fulfilled, (state, action) => {
        state.tags = state.tags.filter(
          (tag) => !action.payload.includes(tag._id)
        );
      });
  }
});

export const { setSelectedTag, clearSelectedTag } = tagSlice.actions;
export default tagSlice.reducer;