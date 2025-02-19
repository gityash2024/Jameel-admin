import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogAPI.getAllBlogs(params);
      console.log(response.data,'response.data');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch blogs');
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBlog = createAsyncThunk(
  'blogs/createBlog',
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await blogAPI.createBlog(blogData);
      toast.success('Blog created successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to create blog');
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await blogAPI.updateBlog(id, data);
      toast.success('Blog updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update blog');
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id, { rejectWithValue }) => {
    try {
      await blogAPI.deleteBlog(id);
      toast.success('Blog deleted successfully');
      return id;
    } catch (error) {
      toast.error('Failed to delete blog');
      return rejectWithValue(error.response.data);
    }
  }
);



export const updateBlogStatus = createAsyncThunk(
  'blogs/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await blogAPI.updateBlogStatus(id, status);
      toast.success('Status updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update status');
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
    blogs: [],
    loading: false,
    error: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    categories: [],
    tags: []
  };
  const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
      resetModal: (state) => {
        state.isModalOpen = false;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchBlogs.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchBlogs.fulfilled, (state, action) => {
            state.loading = false;
            state.blogs = action.payload.data.posts;
            state.total = action.payload.total;
            state.currentPage = action.payload.currentPage;
            state.totalPages = action.payload.totalPages;
            console.log('Fetched blogs:', action.payload.data.posts); // Add this line
          })
        .addCase(fetchBlogs.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(createBlog.fulfilled, (state, action) => {
            state.blogs.unshift(action.payload.data.post);
                      state.total += 1;
        })
        .addCase(updateBlog.fulfilled, (state, action) => {
          const index = state.blogs.findIndex(
            blog => blog._id === action.payload.data.blog._id
          );
          if (index !== -1) {
            state.blogs[index] = action.payload.data.blog;
          }
        })
        .addCase(deleteBlog.fulfilled, (state, action) => {
          state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
          state.total -= 1;
        })
        .addCase(updateBlogStatus.fulfilled, (state, action) => {
          const index = state.blogs.findIndex(
            blog => blog._id === action.payload.data.blog._id
          );
          if (index !== -1) {
            state.blogs[index] = action.payload.data.blog;
          }
        });
    }
  });
  export const { resetModal } = blogSlice.actions;

export default blogSlice.reducer;