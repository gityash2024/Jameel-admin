import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './users/userSlice';
import roleReducer from './role/roleSlice';
import productReducer from './products/productSlice';
import categoryReducer from './category/categorySlice';
import tagReducer from './tags/tagSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    role: roleReducer,
    product: productReducer,
    category: categoryReducer,
    tag: tagReducer
  },
});

