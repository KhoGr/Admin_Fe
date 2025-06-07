import axiosClient from "./AxiosClient";
import {
  WorkShift,
  CreateWorkShiftDto,
  UpdateWorkShiftDto,
} from "../types/workship";

// Phải đúng với prefix router ở backend: /api/workshifts
const URL = "/workshift";

const workShiftApi = {
  // Tạo mới một ca làm việc
  create(data: CreateWorkShiftDto) {
    return axiosClient
      .post<WorkShift>(`${URL}`, data)
      .then((res) => res.data);
  },

  // Lấy tất cả ca làm, có thể filter theo tháng, ngày, hoặc staffId
  getAll(params?: {
    month?: string;
    date?: string;
    staffId?: number;
  }) {
    return axiosClient
      .get<WorkShift[]>(`${URL}`, { params })
      .then((res) => res.data);
  },

  // Lấy ca làm theo staff_id (optionally filter by date)
  getByStaffId(staff_id: number, date?: string) {
    return axiosClient
      .get<WorkShift[]>(`${URL}/${staff_id}`, {
        params: date ? { date } : undefined,
      })
      .then((res) => res.data);
  },

  // Cập nhật ca làm theo shift_id
  update(shift_id: number, data: UpdateWorkShiftDto) {
    return axiosClient
      .put<WorkShift>(`${URL}/${shift_id}`, data)
      .then((res) => res.data);
  },

  // Xoá ca làm theo shift_id
  delete(shift_id: number) {
    return axiosClient
      .delete<{ message: string }>(`${URL}/${shift_id}`)
      .then((res) => res.data);
  },
};

export default workShiftApi;
