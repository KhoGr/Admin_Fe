import axiosClient from './AxiosClient';

const URL = '/monthlyFinance';

const monthlyFinanceApi = {
  getAll() {
    return axiosClient.get(`${URL}/get`);
  },

  getById(id: number) {
    return axiosClient.get(`${URL}/get/${id}`);
  },

  create(data: { month: string }) {
    return axiosClient.post(`${URL}/create`, data);
  },

  update(id: number, data: Partial<{ note: string }>) {
    return axiosClient.put(`${URL}/update/${id}`, data);
  },

  delete(id: number) {
    return axiosClient.delete(`${URL}/delete/${id}`);
  },

  search(keyword: string) {
    return axiosClient.get(`${URL}/search`, {
      params: { keyword },
    });
  },
};

export default monthlyFinanceApi;
