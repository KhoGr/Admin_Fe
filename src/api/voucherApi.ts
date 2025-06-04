import axiosClient from './AxiosClient';
import {
  Voucher,
  CreateVoucherDto,
  UpdateVoucherDto,
  ApplyVoucherRequest,
  ApplyVoucherResult,
  RedeemVoucherRequest,
} from '../types/voucher';

const URL = '/voucher';

const voucherApi = {
  getAll() {
    return axiosClient.get<Voucher[]>(`${URL}/get`);
  },

  create(data: CreateVoucherDto) {
    return axiosClient.post<Voucher>(`${URL}/create`, data);
  },

  update(id: number, data: UpdateVoucherDto) {
    return axiosClient.put<Voucher>(`${URL}/update/${id}`, data);
  },

  delete(id: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/delete/${id}`);
  },

  apply(data: ApplyVoucherRequest) {
    return axiosClient.post<ApplyVoucherResult>(`${URL}/apply`, data);
  },

  redeem(data: RedeemVoucherRequest) {
    return axiosClient.post<{ message: string }>(`${URL}/redeem`, data);
  },
};

export default voucherApi;
