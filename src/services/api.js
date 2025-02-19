  // src/services/api.js
  import axios from 'axios';
  import { toast } from 'react-hot-toast';

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  let loadingToastId = null;

  // Create axios instance
  const http = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor
  http.interceptors.request.use(
    (config) => {
      // Show loading toast
      loadingToastId = toast.loading('Loading...');
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      toast.dismiss(loadingToastId);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  http.interceptors.response.use(
    (response) => {
      toast.dismiss(loadingToastId);
      if (response.data?.message) {
        toast.success(response.data.message);
      }
      return response;
    },
    (error) => {
      toast.dismiss(loadingToastId);
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
      
      // Handle 401 unauthorized error
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  // Auth API endpoints
  export const authAPI = {
    login: (data) => http.post('/auth/login', data),
    register: (data) => http.post('/auth/register', data),
    logout: () => http.post('/auth/logout'),
    getMe: () => http.get('/auth/me'),
    updateProfile: (data) => http.put('/auth/update-details', data),
    updatePassword: (data) => http.put('/auth/update-password', data),
    forgotPassword: (data) => http.post('/auth/forgot-password', data),
    resetPassword: (token, data) => http.post(`/auth/reset-password/${token}`, data),
  };
  export const categoryAPI = {
    getAllCategories: () => http.get('/categories'),
    getCategory: (id) => http.get(`/categories/${id}`),
    createCategory: (data) => http.post('/categories', data),
    updateCategory: (id, data) => http.put(`/categories/${id}`, data),
    deleteCategory: (id) => http.delete(`/categories/${id}`),
    updateCategoryStatus: (id, status) => http.put(`/categories/${id}/status`, { isActive: status })
  };


  export const tagAPI = {
    getAllTags: () => http.get('/tags'),
    getTag: (id) => http.get(`/tags/${id}`),
    getTagBySlug: (slug) => http.get(`/tags/${slug}`),
    createTag: (data) => http.post('/tags', data),
    updateTag: (id, data) => http.put(`/tags/${id}`, data),
    deleteTag: (id) => http.delete(`/tags/${id}`),
    updateTagStatus: (id, status) => http.put(`/tags/${id}/status`, { isActive: status }),
    bulkDeleteTags: (ids) => http.delete('/tags/bulk/delete', { data: { ids } })
  };

  export const productAPI = {
    getAllProducts: (params) => http.get('/products', { params }),
    getProduct: (id) => http.get(`/products/${id}`),
    createProduct: (data) => http.post('/products', data),
    updateProduct: (id, data) => http.put(`/products/${id}`, data),
    deleteProduct: (id) => http.delete(`/products/${id}`),
  };

  export const userAPI = {
    getAllUsers: () => http.get('/users'),
    getUser: (id) => http.get(`/users/${id}`),
    createUser: (data) => http.post('/auth/register', data),
    updateUser: (id, data) => http.put(`/users/${id}`, data),
    deleteUser: (id) => http.delete(`/users/${id}`),
  };
  export const roleAPI = {
    getAllRoles: () => http.get('/roles'),
    createRole: (data) => http.post('/roles', data),
    updateRole: (id, data) => http.put(`/roles/${id}`, data),
    deleteRole: (id) => http.delete(`/roles/${id}`)
  };
  export const blogAPI = {
    getAllBlogs: (params) => http.get('/blogs', { params }),
    getBlog: (id) => http.get(`/blogs/${id}`),
    createBlog: (data) => http.post('/blogs', data),
    updateBlog: (id, data) => http.put(`/blogs/${id}`, data),
    deleteBlog: (id) => http.delete(`/blogs/${id}`),
    updateBlogStatus: (id, status) => http.put(`/blogs/${id}`, { status }),
    getBlogCategories: () => http.get('/blogs/categories'),
    getBlogTags: () => http.get('/blogs/tags'),
  };

  export const mediaAPI = {
    getAllMedia: (params) => http.get('/media', { params }),
    getMedia: (id) => http.get(`/media/${id}`),
    uploadMedia: (data) => http.post('/media', data),
    updateMedia: (id, data) => http.put(`/media/${id}`, data),
    deleteMedia: (id) => http.delete(`/media/${id}`),
  }
  export default http;