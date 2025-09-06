import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubCategoryState {
  subCategories: SubCategory[];
  loading: boolean;
  error: string | null;
  selectedSubCategory: SubCategory | null;
}

const initialState: SubCategoryState = {
  subCategories: [],
  loading: false,
  error: null,
  selectedSubCategory: null,
};

const subCategorySlice = createSlice({
  name: 'subCategories',
  initialState,
  reducers: {
    setSubCategories: (state, action: PayloadAction<SubCategory[]>) => {
      state.subCategories = action.payload;
    },
    addSubCategory: (state, action: PayloadAction<SubCategory>) => {
      state.subCategories.push(action.payload);
    },
    updateSubCategory: (state, action: PayloadAction<SubCategory>) => {
      const index = state.subCategories.findIndex(subCategory => subCategory.id === action.payload.id);
      if (index !== -1) {
        state.subCategories[index] = action.payload;
      }
    },
    deleteSubCategory: (state, action: PayloadAction<string>) => {
      state.subCategories = state.subCategories.filter(subCategory => subCategory.id !== action.payload);
    },
    toggleSubCategoryStatus: (state, action: PayloadAction<string>) => {
      const subCategory = state.subCategories.find(sc => sc.id === action.payload);
      if (subCategory) {
        subCategory.isActive = !subCategory.isActive;
        subCategory.updatedAt = new Date().toISOString();
      }
    },
    setSelectedSubCategory: (state, action: PayloadAction<SubCategory | null>) => {
      state.selectedSubCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSubCategories,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  toggleSubCategoryStatus,
  setSelectedSubCategory,
  setLoading,
  setError,
} = subCategorySlice.actions;

export default subCategorySlice.reducer;
