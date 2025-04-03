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

  export const supportAPI = {
    getAllTickets: (params) => http.get('/support-tickets', { params }),
    getTicket: (id) => http.get(`/support-tickets/${id}`),
    updateTicketStatus: (id, status) => http.put(`/support-tickets/${id}/status`, { status }),
    addTicketResponse: (id, data) => http.post(`/support-tickets/${id}/responses`, data),
    deleteTicket: (id) => http.delete(`/support-tickets/${id}`)
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
    getProduct: async (id) => {
      console.log(`Requesting product with ID: ${id}`);
      try {
        const response = await http.get(`/products/${id}`);
        console.log('Product fetch successful:', response.data);
        return response;
      } catch (error) {
        console.error('Error fetching product:', error.response?.data || error.message);
        throw error;
      }
    },
    createProduct: (data) => http.post('/products', data),
    updateProduct: (id, data) => http.put(`/products/${id}`, data),
    deleteProduct: (id) => http.delete(`/products/${id}`),
  };

  export const storeAPI = {
    getAllStores: () => http.get('/stores'),
    getStore: (id) => http.get(`/stores/${id}`),
    createStore: (data) => http.post('/stores', data),
    updateStore: (id, data) => http.put(`/stores/${id}`, data),
    deleteStore: (id) => http.delete(`/stores/${id}`),
    findNearbyStores: (lat, lng, distance) => 
      http.get(`/stores/nearby?lat=${lat}&lng=${lng}&distance=${distance || 10000}`)
  };

  export const userAPI = {
    getAllUsers: () => http.get('/user'),
    getUser: (id) => http.get(`/user/${id}`),
    createUser: (data) => http.post('/auth/register', data),
    updateUser: (id, data) => http.put(`/user/${id}`, data),
    deleteUser: (id) => http.delete(`/user/${id}`),
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




  export const subcategoryAPI = {
    getAllSubCategories: () => http.get('/subcategories'),
    getSubCategory: (id) => http.get(`/subcategories/${id}`),
    getSubCategoriesByCategory: (categoryId) => http.get(`/subcategories/category/${categoryId}`),
    createSubCategory: (data) => http.post('/subcategories', data),
    updateSubCategory: (id, data) => http.put(`/subcategories/${id}`, data),
    deleteSubCategory: (id) => http.delete(`/subcategories/${id}`),
    updateSubCategoryStatus: (id, status) => http.put(`/subcategories/${id}/status`, { isActive: status })
  };



  export const mediaAPI = {
    getAllMedia: (params) => http.get('/media', { params }),
    getMedia: (id) => http.get(`/media/${id}`),
    uploadMedia: (data) => http.post('/media', data),
    updateMedia: (id, data) => http.put(`/media/${id}`, data),
    deleteMedia: (id) => http.delete(`/media/${id}`),
  }

  export const orderAPI = {
    getAllOrders: async (queryParams) => {
      return await http.get('/orders', { params: queryParams });
    },
    getOrder: async (id) => {
      return await http.get(`/orders/${id}`);
    },
    getOrderById: async (id) => {
      return await http.get(`/orders/${id}`);
    },
    updateOrderStatus: async (id, status) => {
      return await http.put(`/orders/${id}/status`, { status });
    },
    updateShipping: async (id, shippingData) => {
      return await http.put(`/orders/${id}/shipping`, shippingData);
    },
    trackShipment: async (id) => {
      return await http.get(`/orders/${id}/track`);
    },
    createShippingLabel: async (id, serviceType) => {
      return await http.post(`/shipping/create-label/${id}`, { serviceType });
    },
    createOrder: (data) => http.post('/orders', data),
    updateOrder: (id, data) => http.put(`/orders/${id}`, data),
    deleteOrder: (id) => http.delete(`/orders/${id}`),
    getDashboardStats: () => http.get('/orders/stats'),
    generateInvoice: (id) => http.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
    cancelShipment: async (id) => {
      return await http.delete(`/shipping/cancel/${id}`);
    }
  };

  export const shippingAPI = {
    getShippingMethods: () => http.get('/shipping/methods'),
    getDeliveryEstimate: (postalCode, shippingMethod) => 
      http.get(`/shipping/delivery-estimate?postalCode=${postalCode}${shippingMethod ? `&method=${shippingMethod}` : ''}`),
    calculateShippingRates: (data) => http.post('/shipping/rates', data),
    trackShipment: (trackingNumber) => http.get(`/shipping/track/${trackingNumber}`),
    createShippingLabel: (orderId, serviceType) => http.post(`/shipping/create-label/${orderId}`, { serviceType }),
    cancelShipment: (shipmentId) => http.delete(`/shipping/cancel/${shipmentId}`),
  };

  export const paymentAPI = {
    getAllPayments: (params) => http.get('/payments', { params }),
    getPayment: (id) => http.get(`/payments/${id}`),
    getPaymentByOrder: (orderId) => http.get(`/payments/order/${orderId}`),
    processRefund: (paymentId, data) => http.post(`/payments/${paymentId}/refund`, data),
    downloadInvoice: (paymentId) => http.get(`/payments/${paymentId}/invoice`, { 
      responseType: 'blob' 
    }),
    getTransactions: () => http.get('/payments/transactions')
  };

  export const couponAPI = {
    getAllCoupons: (params) => http.get('/coupons', { params }),
    getCoupon: (id) => http.get(`/coupons/${id}`),
    createCoupon: (data) => http.post('/coupons', data),
    updateCoupon: (id, data) => http.put(`/coupons/${id}`, data),
    deleteCoupon: (id) => http.delete(`/coupons/${id}`),
    toggleCouponStatus: (id) => http.patch(`/coupons/${id}/toggle-status`),
    validateCoupon: (code, amount) => http.post('/coupons/validate', { code, amount })
  };

  export default http;