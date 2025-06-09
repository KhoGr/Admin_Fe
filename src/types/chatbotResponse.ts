export interface ChatbotResponse {
  response_id: number;
  keyword: string;
  response: string;
  category?: string;
  ai_model_id: string;
  menu_item_id?: number;

  // Quan hệ mở rộng nếu backend populate
  ai_model?: AIModel;
  menu_item?: MenuItem;

  created_at?: string;
  updated_at?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  item_id: number;
  name: string;
  price: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateChatbotResponseDTO {
  keyword: string;
  response: string;
  category?: string;
  ai_model_id: string;
  menu_item_id?: number;
}

export interface UpdateChatbotResponseDTO {
  keyword?: string;
  response?: string;
  category?: string;
  ai_model_id?: string;
  menu_item_id?: number;
}
