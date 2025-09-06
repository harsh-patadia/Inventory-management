import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import productSlice from './slices/productSlice';
import categorySlice from './slices/categorySlice';
import subCategorySlice from './slices/subCategorySlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    products: productSlice,
    categories: categorySlice,
    subCategories: subCategorySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
