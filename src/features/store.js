import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './users/userSlice';
import roleReducer from './role/roleSlice';
import productReducer from './products/productSlice';
import categoryReducer from './category/categorySlice';
import tagReducer from './tags/tagSlice';
import mediaReducer from './media/mediaSlice';
import blogReducer from './blog/blogSlice';
import subCategoryReducer from './subCategory/subcategorySlice';
import storeReducer from './store/storeSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    role: roleReducer,
    product: productReducer,
    category: categoryReducer,
    tag: tagReducer,
    media: mediaReducer,
    blogs: blogReducer,
    subcategory: subCategoryReducer,
    store: storeReducer

  },
});

