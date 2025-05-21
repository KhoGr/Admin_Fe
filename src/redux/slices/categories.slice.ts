import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import categoryApi from '../../api/categoryApi';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../../types/category';

interface CategoryState {
  data: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  data: [],
  loading: false,
  error: null,
};

// GET ALL
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await categoryApi.getAll();
      return res.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Lấy danh sách thất bại');
    }
  }
);

// SEARCH
export const searchCategories = createAsyncThunk(
  'categories/search',
  async (keyword: string, { rejectWithValue }) => {
    try {
      const res = await categoryApi.search(keyword);
      return res.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Tìm kiếm thất bại');
    }
  }
);

// CREATE
export const createCategory = createAsyncThunk(
  'categories/create',
  async (data: CreateCategoryDTO, { rejectWithValue }) => {
    try {
      const res = await categoryApi.create(data);
      return res.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Tạo danh mục thất bại');
    }
  }
);

// UPDATE
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, data }: { id: number; data: UpdateCategoryDTO }, { rejectWithValue }) => {
    try {
      const res = await categoryApi.update(id, data);
      return res.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Cập nhật danh mục thất bại');
    }
  }
);

// DELETE
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryApi.delete(id);
      return id;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Xóa danh mục thất bại');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // SEARCH
      .addCase(searchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createCategory.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // UPDATE
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.data.findIndex((cat) => cat.id === updated.id);
        if (index !== -1) {
          state.data[index] = updated;
        }
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.data = state.data.filter((cat) => cat.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
