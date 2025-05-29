import axiosInstance from './AxiosClient';
import { Table, CreateTableDto, UpdateTableDto } from '../types/table';
import socket from './socketInit';

const tableApi = {
  getAll(): Promise<Table[]> {
    return axiosInstance.get('/table').then(res => res.data.data);
  },

  getById(id: number): Promise<Table> {
    return axiosInstance.get(`/table/${id}`).then(res => res.data.data);
  },

  create(data: CreateTableDto): Promise<Table> {
    return axiosInstance.post('/table', data).then(res => res.data.data);
  },

  update(id: number, data: UpdateTableDto): Promise<Table> {
    return axiosInstance.put(`/table/${id}`, data, {
      headers: {
        'x-socket-id': socket.id || '', // 👈 Truyền socket.id vào header
      },
    }).then(res => res.data.data);
  },

  delete(id: number): Promise<{ message: string }> {
    return axiosInstance.delete(`/table/${id}`).then(res => res.data);
  },

  book(table_id: number): Promise<Table> {
    return axiosInstance.post('/table/book', { table_id }).then(res => res.data.data);
  },
};

export default tableApi;
