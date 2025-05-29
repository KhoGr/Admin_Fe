import axiosClient from './AxiosClient';
import {
  OrderModel,
  OrderCreateRequest,
  OrderUpdateStatusRequest,
  OrderMarkPaidRequest,
  OrderSearchParams,
} from '../types/Orderlist'

const URL = '/order';

const orderApi = {
  // 📋 🔒 Lấy danh sách tất cả đơn hàng (chỉ admin)
  getAll() {
    return axiosClient.get<OrderModel[]>(`${URL}`).then(res => res.data);
  },

  // 🔍 Tìm kiếm/lọc đơn hàng theo từ khoá/trạng thái/ngày (chỉ admin)
  search(params: OrderSearchParams) {
    return axiosClient.get<OrderModel[]>(`${URL}/search`, { params }).then(res => res.data);
  },

  // 🆕 Tạo mới đơn hàng (nhân viên hoặc khách)
  create(data: OrderCreateRequest) {
    return axiosClient.post<{ message: string; order: OrderModel }>(`${URL}`, data).then(res => res.data.order);
  },

  // 📦 Lấy chi tiết đơn hàng
  getById(orderId: number) {
    return axiosClient.get<{ order: OrderModel }>(`${URL}/${orderId}`).then(res => res.data.order);
  },

  // 🔁 Cập nhật trạng thái đơn hàng
  updateStatus(orderId: number, data: OrderUpdateStatusRequest) {
    return axiosClient.patch<{ message: string }>(`${URL}/${orderId}/status`, data).then(res => res.data);
  },

  // 💰 Đánh dấu đơn hàng đã thanh toán
  markPaid(orderId: number, data: OrderMarkPaidRequest) {
    return axiosClient.patch<{ message: string }>(`${URL}/${orderId}/pay`, data).then(res => res.data);
  },

  // 🔄 Tính lại tổng tiền đơn hàng
  recalculateTotal(orderId: number) {
    return axiosClient.patch<{ message: string; order: OrderModel }>(`${URL}/${orderId}/recalculate`).then(res => res.data.order);
  },

  // ❌ Xoá đơn hàng
  delete(orderId: number) {
    return axiosClient.delete<{ message: string }>(`${URL}/${orderId}`).then(res => res.data);
  },
};

export default orderApi;
