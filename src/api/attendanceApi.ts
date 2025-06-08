import axiosClient from "./AxiosClient";
import {
  Attendance,
  AttendanceCreatePayload,
  AttendanceUpdatePayload,
  AttendanceFilterParams,
} from "../types/attendance";

const URL = "/attendance";

const attendanceApi = {
  // Tạo mới một bản ghi điểm danh
  create(data: AttendanceCreatePayload) {
    return axiosClient.post<Attendance>(`${URL}`, data).then(res => res.data);
  },

  // Lấy tất cả bản ghi điểm danh
  getAll() {
    return axiosClient.get<Attendance[]>(`${URL}`).then(res => res.data);
  },

  // Lấy chi tiết điểm danh theo ID
  getById(attendance_id: number) {
    return axiosClient
      .get<Attendance>(`${URL}/${attendance_id}`)
      .then(res => res.data);
  },

  // Lấy danh sách điểm danh theo staff_id
  getByStaffId(staff_id: number) {
    return axiosClient
      .get<Attendance[]>(`${URL}/staff/${staff_id}`)
      .then(res => res.data);
  },

  // Lọc bản ghi điểm danh theo filter (name, date, status...)
  filter(params: AttendanceFilterParams) {
    return axiosClient
      .get<Attendance[]>(`${URL}/filter`, { params })
      .then(res => res.data);
  },

  // Cập nhật thông tin điểm danh (thường là check-out, status...)
  update(attendance_id: number, data: AttendanceUpdatePayload) {
    return axiosClient
      .put<Attendance>(`${URL}/${attendance_id}`, data)
      .then(res => res.data);
  },

  // Xoá bản ghi điểm danh
  delete(attendance_id: number) {
    return axiosClient
      .delete<{ message: string }>(`${URL}/${attendance_id}`)
      .then(res => res.data);
  },
  getByStaffAndPeriod(staff_id: number, start_date: string, end_date: string) {
  return axiosClient
    .get<Attendance[]>(`${URL}/search-by-period`, {
      params: { staff_id, start_date, end_date },
    })
    .then(res => res.data);
},
};

export default attendanceApi;
