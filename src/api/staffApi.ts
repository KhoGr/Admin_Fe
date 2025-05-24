import axiosClient from './AxiosClient';
import {
  StaffModel,
  StaffCreateRequest,
  StaffUpdateRequest,
} from '../types/staff';

const URL = '/staff';

const staffApi = {
  create(data: StaffCreateRequest) {
    return axiosClient.post<StaffModel>(`${URL}/createStaff`, data);
  },

  getById(userId: number) {
    return axiosClient.get<StaffModel>(`${URL}/getStaff/${userId}`);
  },

  update(userId: number, data: StaffUpdateRequest) {
    return axiosClient.put<StaffModel>(`${URL}/updateStaff/${userId}`, data);
  },

  delete(userId: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/deleteStaff/${userId}`);
  },
};

export default staffApi;
