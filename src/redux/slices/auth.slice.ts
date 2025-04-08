
//////////////////////////////


import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import userApi from '../../api/userApi';
import {
  RegisterLocalRequest,
  postLoginRequest,
  getMeResponse, 
} from '../../types/User';


export interface UserProfile {
  email:string;
  id: number;
  account_id: number;
  name: string;
  username: string;
  avatar: string | null;
  phone: string | null;
  address: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterLocalRequest, { rejectWithValue }) => {
    try {
      const response = await userApi.register(userData);
      return response.data; 
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Đăng ký thất bại'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: postLoginRequest, { rejectWithValue }) => {
    try {
      const response = await userApi.login(loginData);
      const { token, expires } = response.data; 

      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpires", expires);  

      return { token, expires };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Đăng nhập thất bại'
      );
    }
  }
);


export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getMe();
      if (response.data && response.data.user) {
        return response.data.user;
      } else {
        return rejectWithValue('Không có thông tin người dùng');
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Không thể lấy thông tin người dùng'
      );
    }
  }
);

/////////////////////////////////////////////////////
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');// fix lại cái này
      localStorage.removeItem("tokenExpires")
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = (action.payload as any)?.user ?? null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("tokenExpires", action.payload.expires);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload ?? null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;