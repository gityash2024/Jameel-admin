import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roleAPI } from '../../services/api';

export const fetchRoles = createAsyncThunk('role/fetchRoles', async () => {
  const response = await roleAPI.getAllRoles();
  return response.data;
});

export const createRole = createAsyncThunk('role/createRole', async (roleData) => {
  const response = await roleAPI.createRole(roleData);
  return response.data;
});

export const updateRole = createAsyncThunk('role/updateRole', async ({ id, roleData }) => {
  const response = await roleAPI.updateRole(id, roleData);
  return response.data;
});

export const deleteRole = createAsyncThunk('role/deleteRole', async (id) => {
  await roleAPI.deleteRole(id);
  return id;
});

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.data.roles;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload.data.role);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex(role => role._id === action.payload.data.role._id);
        if (index !== -1) {
          state.roles[index] = action.payload.data.role;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter(role => role._id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default roleSlice.reducer;