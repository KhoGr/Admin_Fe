export type MembershipLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface CustomerModel {
  customer_id: number;
  user_id: number;
  loyalty_point: number;
  total_spent: number | string; // vì API trả về là chuỗi "0.00"
  membership_level: MembershipLevel;
  note?: string | null;
  created_at: string; // ISO date string
  updated_at: string;

  user_info?: {
    user_id: number;
    name: string;
    username: string;
    avatar?: string;
    phone?: string;
    address?: string;
    role?: string;
    account?: {
      email: string;
    };
    created_at?: string;
    updated_at?: string;
  };
}

export interface CustomerCreateRequest {
  user_id: number;
  loyalty_point?: number;
  total_spent?: number;
  membership_level?: MembershipLevel;
  note?: string;
}

export interface CustomerUpdateRequest {
  loyalty_point?: number;
  total_spent?: number;
  membership_level?: MembershipLevel;
  note?: string;
}
