import axiosClient from './AxiosClient';
import {
  ChatbotResponse,
  CreateChatbotResponseDTO,
  UpdateChatbotResponseDTO,
} from '../types/chatbotResponse';

const BASE_URL = '/chatbot';

const chatbotResponseApi = {
  // ✅ Gửi truy vấn người dùng đến GPT/chatbot
handleQuery(userInput: string) {
  return axiosClient.post<{ reply: string }>(`${BASE_URL}/query`, { message: userInput });
},

  // ✅ Lấy tất cả chatbot responses
  getAll() {
    return axiosClient.get<ChatbotResponse[]>(`${BASE_URL}/responses/get`);
  },

  // ✅ Lấy response theo ID
  getById(id: number) {
    return axiosClient.get<ChatbotResponse>(`${BASE_URL}/responses/get/${id}`);
  },

  // ✅ Tạo mới response
  create(data: CreateChatbotResponseDTO) {
    return axiosClient.post<ChatbotResponse>(`${BASE_URL}/responses/create`, data);
  },

  // ✅ Cập nhật response
  update(id: number, data: UpdateChatbotResponseDTO) {
    return axiosClient.put<ChatbotResponse>(`${BASE_URL}/responses/update/${id}`, data);
  },

  // ✅ Xoá response
  delete(id: number) {
    return axiosClient.delete<{ message: string }>(`${BASE_URL}/responses/delete/${id}`);
  },

  // ✅ (Nếu bạn thêm sau) Tìm kiếm theo keyword
  search(keyword: string) {
    return axiosClient.get<ChatbotResponse[]>(`${BASE_URL}/responses/search`, {
      params: { keyword },
    });
  },
};

export default chatbotResponseApi;
