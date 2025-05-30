import axiosClient from './AxiosClient';
import {
  Comment,
  CommentResponse,
  CreateCommentPayload,
  UpdateCommentPayload,
  SearchCommentQuery,
} from '../types/comment';

const URL = '/menu-item-comment';

const commentApi = {
  // ✅ Lấy tất cả comment
  getAll() {
    return axiosClient.get<CommentResponse[]>(`${URL}/`);
  },

  // Lấy tất cả comment theo menu item ID
  getByMenuItemId(itemId: string) {
    return axiosClient.get<CommentResponse[]>(`${URL}/item/${itemId}`);
  },

  // Tạo comment mới
  create(data: CreateCommentPayload) {
    return axiosClient.post<CommentResponse>(`${URL}/`, data);
  },

  // Cập nhật comment theo comment ID
  update(commentId: string, data: UpdateCommentPayload) {
    return axiosClient.put<CommentResponse>(`${URL}/${commentId}`, data);
  },

  // Xoá comment
  delete(commentId: string) {
    return axiosClient.delete<{ message: string }>(`${URL}/${commentId}`);
  },

  // Tìm kiếm comment theo rating, tên khách hàng, tên món ăn
  search(params: SearchCommentQuery) {
      console.log('📨 Sending filters to backend:', params);

    return axiosClient.get<CommentResponse[]>(`${URL}/search`, {
      params,
    });
  },
};

export default commentApi;
