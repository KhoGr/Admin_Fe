import axiosClient from './AxiosClient';
import {
  InventoryBatchPayload,
  InventoryBatchResponse,
} from '../types/inventoryBatch';

const URL = '/inventory';

const inventoryBatchApi = {
  getAll() {
    return axiosClient.get<InventoryBatchResponse[]>(`${URL}/get`);
  },

  getById(id: number) {
    return axiosClient.get<InventoryBatchResponse>(`${URL}/get/${id}`);
  },

  create(data: InventoryBatchPayload) {
    return axiosClient.post<InventoryBatchResponse>(`${URL}/create`, data);
  },

  update(id: number, data: InventoryBatchPayload) {
    return axiosClient.put<InventoryBatchResponse>(`${URL}/update/${id}`, data);
  },

  delete(id: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/delete/${id}`);
  },

  search(keyword: string) {
    return axiosClient.get<InventoryBatchResponse[]>(`${URL}/search`, {
      params: { keyword },
    });
  },

  getByMonth(month: string) {
    return axiosClient.get<InventoryBatchResponse[]>(`${URL}/month`, {
      params: { month },
    });
  },

  getUniqueItemNames() {
    return axiosClient.get<string[]>(`${URL}/names`);
  },
};

export default inventoryBatchApi;
