export type ResponseStyle = 'friendly' | 'precise' | 'creative' | 'concise' | 'detailed';

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  specialties?: string[]; // mảng như ["menu", "hours"]
  response_style: ResponseStyle;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAIModelDTO {
  id: string; // bạn cần chỉ định ID khi tạo (hoặc để BE tự generate nếu sửa model)
  name: string;
  description?: string;
  specialties?: string[];
  response_style: ResponseStyle;
}

export interface UpdateAIModelDTO {
  name?: string;
  description?: string;
  specialties?: string[];
  response_style?: ResponseStyle;
}
