import axiosClient from './AxiosClient';
import {
  RegisterLocalRequest,
  RegisterLocalResponse,
  verifyAccountRequest,
  verifyAccountResponse,
  postLoginRequest,
  postLoginResponse,
  postLogoutRequest,
  requestPasswordReset,
  responsePasswordReset,
  resetPasswordRequest,
  resetPasswordResponse,
  updatePasswordRequest,
  updatePasswordResponse,
  getUserProfileResponse,
  googleAuthenResponse,
  getMeResponse,
  adminLoginRequest,
  adminLoginResponse,
} from '../types/User';

const URL = '/account';
// sửa data thành request
const userApi = {
  register(data: RegisterLocalRequest) {
    return axiosClient.post<RegisterLocalResponse>(`${URL}/register`, data);
  },

  login(data: postLoginRequest) {
    return axiosClient.post<postLoginResponse>(`${URL}/login`, data);
  },

  logout() {
    return axiosClient.post<postLogoutRequest>(`${URL}/logout`);
  },
  getMe() {
    return axiosClient.get<getMeResponse>(`${URL}/me`);
  },
  updatePassword(data: updatePasswordRequest) {
    return axiosClient.put<updatePasswordResponse>(`${URL}/update-password`, data);
  },
  //xong đến đây

  verifyAccount(data: verifyAccountRequest) {
    return axiosClient.get<verifyAccountResponse>(`${URL}/verify-account`, { params: data });
  },

  requestPasswordReset(data: requestPasswordReset) {
    return axiosClient.post<responsePasswordReset>(`${URL}/reset-password-request`, data);
  },

  resetPassword(data: resetPasswordRequest) {
    return axiosClient.post<resetPasswordResponse>(`${URL}/reset-password`, data);
  },

  getUserProfile() {
    return axiosClient.get<getUserProfileResponse>(`${URL}/profile`);
  },

  updateAvatar(data: FormData) {
    return axiosClient.put(`${URL}/update-avt`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateUserProfile(data: unknown) {
    return axiosClient.put(`${URL}/update-profile`, data);
  },

  googleLogin() {
    return axiosClient.get<googleAuthenResponse>(`${URL}/auth/google`);
  },

  googleLoginCallback() {
    return axiosClient.get<googleAuthenResponse>(`${URL}/auth/google/callback`);
  },
  adminLogin(data: adminLoginRequest) {
    return axiosClient.post<adminLoginResponse>(`${URL}/admin-login`, data);
  },
};

export default userApi;
