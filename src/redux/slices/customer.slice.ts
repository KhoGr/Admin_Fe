// redux/slices/customers.slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import customerApi from '../../api/customerApi';
import {
  CustomerModel,
  CustomerCreateRequest,
  CustomerUpdateRequest,
} from '../../types/Customer';

interface CustomerState {
  data: CustomerModel[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  data: [],
  loading: false,
  error: null,
};

// GET ALL
export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await customerApi.getAll();
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Lấy danh sách khách hàng thất bại');
    }
  }
);

// SEARCH
export const searchCustomers = createAsyncThunk(
  'customers/search',
  async (name: string, { rejectWithValue }) => {
    try {
      const res = await customerApi.searchByName(name);
      return res;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Tìm kiếm khách hàng thất bại');
    }
  }
);

// CREATE
export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data: CustomerCreateRequest, { rejectWithValue }) => {
    try {
      const res = await customerApi.create(data);
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Tạo khách hàng thất bại');
    }
  }
);

// UPDATE
export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ userId, data }: { userId: number; data: CustomerUpdateRequest }, { rejectWithValue }) => {
    try {
      const res = await customerApi.update(userId, data);
      return res.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Cập nhật khách hàng thất bại');
    }
  }
);

// DELETE
export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (userId: number, { rejectWithValue }) => {
    try {
      await customerApi.delete(userId);
      return userId;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Xóa khách hàng thất bại');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // SEARCH
      .addCase(searchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // UPDATE
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.data.findIndex((c) => c.customer_id === updated.customer_id);
        if (index !== -1) {
          state.data[index] = updated;
        }
      })

      // DELETE
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c.customer_id !== action.payload);
      });
  },
});

export default customersSlice.reducer;
