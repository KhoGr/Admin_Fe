// order.types.ts

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'served'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type OrderType = 'dine-in' | 'take-away' | 'delivery';

export interface OrderItemModel {
  order_item_id: number;
  order_id: number;
  item_id: number;
  quantity: number;
  price: number | string;

  menu_item?: {
    item_id: number;
    name: string;
    description?: string;
    price: number | string;
    image?: string;
    category_id?: number;
  };
}

export interface OrderModel {
  order_id: number;
  customer_id?: number | null;
  table_id?: number | null;
  guest_count?: number | null;
  order_type: OrderType;
  order_date: string;
  total_amount?: number | string | null;
  discount_amount: number | string;
  final_amount?: number | string | null;
  status: OrderStatus;
  payment_method?: string | null;
  is_paid: boolean;
  note?: string | null;
  created_at: string;
  updated_at: string;

  customer?: {
    customer_id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };

  table?: {
    table_id: number;
    name: string;
    location?: string;
    capacity?: number;
  };

  order_items?: OrderItemModel[];
}

export interface OrderCreateRequest {
  customer_id?: number;
  table_id?: number;
  guest_count?: number;
  order_type?: OrderType;
  discount_amount?: number;
  payment_method?: string;
  note?: string;
  order_items: {
    item_id: number;
    quantity: number;
    price?: number;
  }[];
}

export interface OrderUpdateStatusRequest {
  status: OrderStatus;
}

export interface OrderMarkPaidRequest {
  is_paid: boolean;
}

export interface OrderRecalculateRequest {
  // No payload required if just recalculating on server
}

export interface OrderSearchParams {
  keyword?: string;
  status?: OrderStatus;
  date_from?: string; // ISO format
  date_to?: string;   // ISO format
}

export interface OrderCreateRequest {
  customer_id?: number;
  table_id?: number;
  guest_count?: number;
  order_type?: 'dine-in' | 'take-away' | 'delivery';
  discount_amount?: number;
  payment_method?: string;
  note?: string;
  order_items: {
    item_id: number;
    quantity: number;
    price?: number;
  }[];
}