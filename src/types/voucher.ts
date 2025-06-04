export interface Voucher {
  voucher_id: number;
  code: string;
  type: 'flat' | 'percent';
  value: number;
  usage_limit?: number | null;
  usage_limit_per_user?: number | null;
  expires_at?: string | null; // ISO date string
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateVoucherDto {
  code: string;
  type: 'flat' | 'percent';
  value: number;
  usage_limit?: number | null;
  usage_limit_per_user?: number | null;
  expires_at?: string | null;
}

export interface UpdateVoucherDto {
  code?: string;
  type?: 'flat' | 'percent';
  value?: number;
  usage_limit?: number | null;
  usage_limit_per_user?: number | null;
  expires_at?: string | null;
  is_active?: boolean;
}

export interface ApplyVoucherRequest {
  code: string;
  customerId: number;
  orderTotal: number;
}

export interface ApplyVoucherResult {
  voucher: Voucher;
  discountAmount: number;
  finalTotal: number;
}

export interface RedeemVoucherRequest {
  voucherId: number;
  customerId: number;
}
