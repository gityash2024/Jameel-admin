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

// User management API endpoints
export const userAPI = {
  getAllUsers: () => http.get('/auth/users'),
  getUser: (id) => http.get(`/auth/users/${id}`),
  updateUser: (id, data) => http.put(`/auth/users/${id}`, data),
  deleteUser: (id) => http.delete(`/auth/users/${id}`),
};

export default http;