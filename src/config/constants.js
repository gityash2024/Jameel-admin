// API URL based on environment
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.jskelite.com'  // Replace with your production API URL
  : 'http://localhost:5000';

// Image CDN URL
export const IMAGE_CDN_URL = process.env.NODE_ENV === 'production'
  ? 'https://res.cloudinary.com/dssi3kihf/image/upload'
  : 'http://localhost:5000/uploads';

// Admin routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  CUSTOMERS: '/customers',
  PAYMENTS: '/payments',
  CATEGORIES: '/categories',
  SETTINGS: '/settings',
  MEDIA: '/media'
};

// Table pagination
export const TABLE_ROWS_PER_PAGE = 10;

// Date format
export const DATE_FORMAT = 'DD/MM/YYYY';

// Status colors
export const STATUS_COLORS = {
  active: '#1e8e3e',
  inactive: '#d93025',
  pending: '#b06000',
  completed: '#1e8e3e',
  processing: '#1a73e8',
  shipped: '#188038',
  delivered: '#1e8e3e',
  cancelled: '#d93025',
  refunded: '#5f6368'
}; 