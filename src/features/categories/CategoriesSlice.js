import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories`, getAuthHeader());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/add',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/categories`,
        categoryData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/categories/${id}`,
        categoryData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`, getAuthHeader());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete category');
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      })
      // Add category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add category';
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update category';
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete category';
      });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
