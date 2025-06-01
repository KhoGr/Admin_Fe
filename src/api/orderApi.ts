import axiosClient from './AxiosClient';
import {
  Order,
  OrderResponse,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  MarkAsPaidPayload,
  SearchOrderQuery,
} from '../types/Orderlist';

const URL = '/order';

const orderApi = {
  // 📋 🔒 Lấy tất cả đơn hàng (admin)
  getAll() {
    return axiosClient.get<OrderResponse[]>(`${URL}`).then(res => res.data);
  },

  // 🔍 Tìm kiếm/lọc đơn hàng theo từ khoá/trạng thái/ngày
  search(params: SearchOrderQuery) {
    return axiosClient.get<OrderResponse[]>(`${URL}/search`, { params }).then(res => res.data);
  },

  // 🆕 Tạo mới đơn hàng
  create(data: CreateOrderPayload) {
    return axiosClient
      .post<{ message: string; order: OrderResponse }>(`${URL}`, data)
      .then(res => res.data.order);
  },

  // 📦 Lấy chi tiết đơn hàng theo ID
  getById(orderId: number) {
    return axiosClient
      .get<{ order: OrderResponse }>(`${URL}/${orderId}`)
      .then(res => res.data.order);
  },

  // 🔁 Cập nhật trạng thái đơn hàng
  updateStatus(orderId: number, data: UpdateOrderStatusPayload) {
    return axiosClient
      .patch<{ message: string }>(`${URL}/${orderId}/status`, data)
      .then(res => res.data);
  },

  // 💰 Đánh dấu đã thanh toán
  markPaid(orderId: number, data: MarkAsPaidPayload) {
    return axiosClient
      .patch<{ message: string }>(`${URL}/${orderId}/pay`, data)
      .then(res => res.data);
  },

  // 🔄 Tính lại tổng tiền đơn hàng
  recalculateTotal(orderId: number) {
    return axiosClient
      .patch<{ message: string; order: OrderResponse }>(`${URL}/${orderId}/recalculate`)
      .then(res => res.data.order);
  },

  // ❌ Xoá đơn hàng
  delete(orderId: number) {
    return axiosClient
      .delete<{ message: string }>(`${URL}/${orderId}`)
      .then(res => res.data);
  },
};

export default orderApi;
