import axiosClient from './AxiosClient';
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../types/category';

const URL = '/category'; 

const categoryApi = {
  getAll() {
    return axiosClient.get<Category[]>(`${URL}/get`);
  },

  getById(id: number) {
    return axiosClient.get<Category>(`${URL}/get/${id}`);
  },

  create(data: CreateCategoryDTO) {
    return axiosClient.post<Category>(`${URL}/create-controller`, data);
  },

  update(id: number, data: UpdateCategoryDTO) {
    return axiosClient.put<Category>(`${URL}/update/${id}`, data);
  },

  delete(id: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/delete/${id}`);
  },
    search(keyword: string) {
    return axiosClient.get<Category[]>(`${URL}/search`, {
      params: { keyword },
    });
  },

};

export default categoryApi;
