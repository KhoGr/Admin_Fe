export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'served'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type OrderType = 'reservation' | 'dine-in' | 'take-away' | 'delivery';
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'unavailable';
export type VoucherType = 'flat' | 'percent';
export type PaymentMethod = 'cash' | 'atm' | 'vnpay' | 'momo' | string;

// Account info nested in user_info
export interface AccountModel {
  email: string;
}

export interface UserInfoModel {
  user_id: number;
  account_id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  account?: AccountModel;
}

export interface CustomerModel {
  customer_id: number;
  user_id: number;
  loyalty_point: number;
  total_spent: number;
  membership_level: string;
  created_at?: string;
  updated_at?: string;
  user_info?: UserInfoModel;
  vip_id?: number;
}

export interface TableModel {
  table_id: number;
  table_number: string;
  status: TableStatus;
  seat_count: number;
  floor?: number;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VoucherModel {
  voucher_id: number;
  code: string;
  type: VoucherType;
  value: number;
  usage_limit?: number | null;
  usage_limit_per_user?: number | null;
  expires_at?: string | null;
  is_active: boolean;
}

export interface MenuItemModel {
  item_id: number;
  name: string;
  price: string;
  image_url?: string;
  discount_percent?: string;
  is_available: boolean;
  is_combo: boolean;
  category_id: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItemModel {
  order_item_id: number;
  order_id: number;
  item_id: number;
  quantity: number;
  price: number | null;
  total?: number;
  menu_item?: MenuItemModel;
}

export interface OrderModel {
  id: number;
  customer_id?: number | null;
  voucher_id?: number | null;
  guest_count?: number | null;
  order_type: OrderType;
  reservation_time?: string | null;
  delivery_address?: string | null;
  phone?: string | null;
  order_date: string;
  total_amount: number;
  discount_amount: string;
  vip_discount_percent?: number;
  shipping_fee?: string;
  free_shipping_applied: boolean;
  final_amount: string;
  status: OrderStatus;
  payment_method?: PaymentMethod | null;
  is_paid: boolean;
  note?: string | null;
  created_at: string;
  updated_at: string;

  customer?: CustomerModel;
  tables?: TableModel[];
  voucher?: VoucherModel;
  order_items?: OrderItemModel[];
}

export interface OrderCreateRequest {
  customer_id?: number | null;
  table_ids?: number[];
  voucher_id?: number | null;
  guest_count?: number | null;
  order_type: OrderType;
  reservation_time?: string;
  delivery_address?: string;
  phone?: string;

  order_items: {
    item_id: number;
    quantity: number;
  }[];

  note?: string;
  order_date?: string;
  total_amount?: number;
  discount_amount?: number;
  vip_discount_percent?: number;
  shipping_fee?: number;
  free_shipping_applied?: boolean;
  final_amount?: number;
  status?: OrderStatus;
  payment_method?: PaymentMethod;
  is_paid?: boolean;
}

export interface OrderUpdateRequest {
  status?: OrderStatus;
  is_paid?: boolean;
  note?: string;
  table_ids?: number[];
  voucher_code?: string;
  reservation_time?: string;
  delivery_address?: string;
  phone?: string;
}
