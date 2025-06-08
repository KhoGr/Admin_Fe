import axiosClient from "./AxiosClient";
import {
  Payroll,
  PayrollCreatePayload,
  PayrollStatusUpdatePayload,
} from "../types/payroll";

const URL = "/payroll";

const payrollApi = {
  // Tạo bảng lương cho 1 nhân viên
  create(data: PayrollCreatePayload) {
    return axiosClient.post<Payroll>(`${URL}`, data).then(res => res.data);
  },

  // Tạo bảng lương cho toàn bộ nhân viên
  generateAll(data: { period_start: string; period_end: string }) {
    return axiosClient
      .post<Payroll[]>(`${URL}/generate-all`, data)
      .then(res => res.data);
  },

  // Lấy toàn bộ bảng lương
  getAll() {
    return axiosClient.get<Payroll[]>(`${URL}`).then(res => res.data);
  },

  // Lấy chi tiết bảng lương theo ID
  getById(payroll_id: number) {
    return axiosClient
      .get<Payroll>(`${URL}/${payroll_id}`)
      .then(res => res.data);
  },

  // Cập nhật trạng thái bảng lương (VD: từ "pending" → "paid")
  updateStatus(payroll_id: number, data: PayrollStatusUpdatePayload) {
    return axiosClient
      .put<Payroll>(`${URL}/${payroll_id}/status`, data)
      .then(res => res.data);
  },

  // Xoá bảng lương
  delete(payroll_id: number) {
    return axiosClient
      .delete<{ message: string }>(`${URL}/${payroll_id}`)
      .then(res => res.data);
  },
};

export default payrollApi;
