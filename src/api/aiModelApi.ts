import axiosClient from './AxiosClient';
import {
  AIModel,
  CreateAIModelDTO,
  UpdateAIModelDTO,
} from '../types/aiModel';

const URL = '/aimodel';

const aiModelApi = {
  // Lấy tất cả models
  getAll() {
    return axiosClient.get<AIModel[]>(`${URL}/get`);
  },

  // Lấy 1 model theo ID
  getById(id: string) {
    return axiosClient.get<AIModel>(`${URL}/get/${id}`);
  },

  // Tạo model mới (admin)
  create(data: CreateAIModelDTO) {
    return axiosClient.post<AIModel>(`${URL}/create`, data);
  },

  // Cập nhật model (admin)
  update(id: string, data: UpdateAIModelDTO) {
    return axiosClient.put<AIModel>(`${URL}/update/${id}`, data);
  },

  // Xoá model (admin)
  delete(id: string) {
    return axiosClient.delete<{ message: string }>(`${URL}/delete/${id}`);
  },
};

export default aiModelApi;
