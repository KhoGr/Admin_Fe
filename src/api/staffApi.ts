import axiosClient from './AxiosClient';
import { StaffModel, StaffCreateRequest, StaffUpdateRequest } from '../types/staff';

const URL = '/staff';

const staffApi = {
getAll() {
  return axiosClient.get<StaffModel[]>(`${URL}`).then(res => res.data);
},

  getById(userId: number) {
    return axiosClient.get<{ staff: StaffModel }>(`${URL}/${userId}`).then(res => res.data.staff);
  },

  create(data: StaffCreateRequest) {
    return axiosClient.post<{ message: string; staff: StaffModel }>(`${URL}`, data).then(res => res.data.staff);
  },

  update(userId: number, data: StaffUpdateRequest) {
    return axiosClient.put<{ message: string }>(`${URL}/${userId}`, data).then(res => res.data);
  },

  delete(userId: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/${userId}`).then(res => res.data);
  },

  searchByName(name: string) {
    return axiosClient.get<StaffModel[]>(`${URL}/search?name=${name}`);
  },
};

export default staffApi;
