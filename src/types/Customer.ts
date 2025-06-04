// Định nghĩa các cấp độ hội viên
export type MembershipLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

// Thông tin cấp độ VIP đi kèm với Customer
export interface VipLevel {
  id: number;
  name: MembershipLevel; // hoặc string nếu backend trả về không chuẩn hóa
}

// Mô hình Customer đầy đủ
export interface CustomerModel {
  customer_id: number;
  user_id: number;
  vip_id: number; // ID của cấp độ VIP
  loyalty_point: number;
  total_spent: number | string; // API trả chuỗi "0.00"
  membership_level: MembershipLevel;
  note?: string | null;
  created_at: string; // ISO date string
  updated_at: string;

  // Quan hệ với bảng VIP
  vip_level?: VipLevel;

  // Thông tin người dùng liên kết
  user_info?: {
    user_id: number;
    name: string;
    username: string;
    avatar?: string | null;
    phone?: string | null;
    address?: string | null;
    role?: string;
    account?: {
      email: string;
    };
    created_at?: string;
    updated_at?: string;
  };
}

// Dữ liệu gửi khi tạo Customer
export interface CustomerCreateRequest {
  user_id: number;
  loyalty_point?: number;
  total_spent?: number;
  membership_level?: MembershipLevel;
  note?: string;
}

// Dữ liệu gửi khi cập nhật Customer
export interface CustomerUpdateRequest {
  loyalty_point?: number;
  total_spent?: number;
  membership_level?: MembershipLevel;
  note?: string;
}
