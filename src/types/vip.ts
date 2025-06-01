export interface VipLevel {
  id: number;
  name: string;
  description?: string;
  min_total_spent: number;
  discount_percent: number;
  free_shipping_threshold?: number | null;
  benefits?: Record<string, any> | null;
  created_at: string; // ISO string
  updated_at: string;
}

export interface CreateVipLevelDto {
  name: string;
  description?: string;
  min_total_spent: number;
  discount_percent: number;
  free_shipping_threshold?: number;
  benefits?: Record<string, any>;
}

export interface UpdateVipLevelDto {
  name?: string;
  description?: string;
  min_total_spent?: number;
  discount_percent?: number;
  free_shipping_threshold?: number | null;
  benefits?: Record<string, any> | null;
}
  export interface VipBenefits {
    freeDelivery?: boolean;
    prioritySupport?: boolean;
    monthlyVouchers?: number;
    [key: string]: any;
  }

   export interface VipLevelTableRecord extends VipLevel {
    benefits?: VipBenefits | null;
  }