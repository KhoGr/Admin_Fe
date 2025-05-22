import axiosClient from './AxiosClient';
import {
  MenuItem,
  CreateMenuItemDTO,
  UpdateMenuItemDTO,
} from '../types/menuItem';

const URL = '/menuitem';

const menuItemApi = {
  getAll() {
    return axiosClient.get<MenuItem[]>(`${URL}/get`);
  },

  getById(id: number) {
    return axiosClient.get<MenuItem>(`${URL}/get/${id}`);
  },

  create(data: CreateMenuItemDTO) {
    return axiosClient.post<MenuItem>(`${URL}/create`, data);
  },

  update(id: number, data: UpdateMenuItemDTO) {
    return axiosClient.put<MenuItem>(`${URL}/update/${id}`, data);
  },

  delete(id: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/delete/${id}`);
  },

  search(params: { keyword?: string; category_id?: number }) {
    return axiosClient.get<MenuItem[]>(`${URL}/search`, {
      params,
    });
  },

  updateImage(id: number, data: FormData) {
    return axiosClient.patch<{ message: string; image_url: string }>(
      `${URL}/update-image/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};

export default menuItemApi;
