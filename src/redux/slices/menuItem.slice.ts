// redux/slices/menuItems.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import menuItemApi from '../../api/menuItemApi';
import {
  MenuItem,
  CreateMenuItemDTO,
  UpdateMenuItemDTO,
} from '../../types/menuItem';

interface MenuItemState {
  data: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuItemState = {
  data: [],
  loading: false,
  error: null,
};

// GET ALL
export const fetchMenuItems = createAsyncThunk(
  'menuItems/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await menuItemApi.getAll();
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Lấy danh sách món ăn thất bại');
    }
  }
);

// SEARCH
export const searchMenuItems = createAsyncThunk(
  'menuItems/search',
  async (
    params: { keyword?: string; category_id?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await menuItemApi.search(params); // gửi cả keyword và category_id
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Tìm kiếm thất bại'
      );
    }
  }
);

// CREATE
export const createMenuItem = createAsyncThunk(
  'menuItems/create',
  async (data: CreateMenuItemDTO, { rejectWithValue }) => {
    try {
      const res = await menuItemApi.create(data);
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Tạo món ăn thất bại');
    }
  }
);

// UPDATE
export const updateMenuItem = createAsyncThunk(
  'menuItems/update',
  async ({ id, data }: { id: number; data: UpdateMenuItemDTO }, { rejectWithValue }) => {
    try {
      const res = await menuItemApi.update(id, data);
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Cập nhật món ăn thất bại');
    }
  }
);

// DELETE
export const deleteMenuItem = createAsyncThunk(
  'menuItems/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await menuItemApi.delete(id);
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Xóa món ăn thất bại');
    }
  }
);

const menuItemsSlice = createSlice({
  name: 'menuItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // SEARCH
      .addCase(searchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(searchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // UPDATE
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.data.findIndex((item) => item.item_id === updated.item_id);
        if (index !== -1) {
          state.data[index] = updated;
        }
      })

      // DELETE
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        if (typeof action.payload === 'number') {
          state.data = state.data.filter((item) => Number(item.item_id) !== action.payload);
        }
      });
  },
});

export default menuItemsSlice.reducer;
