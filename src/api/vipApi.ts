import axiosClient from './AxiosClient';
import {
  VipLevel,
  CreateVipLevelDto,
  UpdateVipLevelDto,
} from '../types/vip';

const URL = '/vip'; // Đổi cho đúng với route backend (đã đăng ký là /membership)

const vipAPi = {
  getAll() {
    return axiosClient.get<VipLevel[]>(`${URL}/get`);
  },

  getById(id: number) {
    return axiosClient.get<VipLevel>(`${URL}/get/${id}`);
  },

  create(data: CreateVipLevelDto) {
    return axiosClient.post<VipLevel>(`${URL}/create`, data); // ✅ sửa lại đúng endpoint
  },

  update(id: number, data: UpdateVipLevelDto) {
    return axiosClient.put<VipLevel>(`${URL}/update/${id}`, data);
  },

  delete(id: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/delete/${id}`);
  },

  search(keyword: string) {
    return axiosClient.get<VipLevel[]>(`${URL}/search`, {
      params: { keyword },
    });
  },

  getLevelForSpent(total_spent: number) {
    return axiosClient.get<VipLevel | null>(`${URL}/level-for-spent`, {
      params: { total_spent },
    });
  },
};

export default vipAPi;
