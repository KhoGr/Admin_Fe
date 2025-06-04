import axiosClient from './AxiosClient';
import { CustomerModel, CustomerCreateRequest, CustomerUpdateRequest } from '../types/Customer';

const URL = '/customer';

const customerApi = {
  getAll() {
    return axiosClient.get<CustomerModel[]>(`${URL}/getAllCustomers`);
  },

  getById(userId: number) {
    return axiosClient.get<CustomerModel>(`${URL}/getCustomer/${userId}`);
  },

  create(data: CustomerCreateRequest) {
    return axiosClient.post<CustomerModel>(`${URL}/createCustomer`, data);
  },

  update(userId: number, data: CustomerUpdateRequest) {
    return axiosClient.put<CustomerModel>(`${URL}/updateCustomer/${userId}`, data);
  },

  delete(userId: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/deleteCustomer/${userId}`);
  },
searchByName(name: string): Promise<CustomerModel[]> {
  return axiosClient.get(`${URL}/search`, {
    params: { name },
  }).then(res => res.data);
}
};

export default customerApi;
