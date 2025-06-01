// Một mục trong đơn hàng
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;        // đơn giá
  total_price: string;  // price * quantity
  created_at: string;
  updated_at: string;

  product?: {
    name: string;
    image?: string | null;
  };
}

// Interface hiển thị đơn hàng trong UI
export interface Order {
  id: number;
  customer_id: number | null;
  table_id: number | null;
  guest_count: number | null;
  order_type: 'dine-in' | 'take-away' | 'delivery';
  order_date: string; // ISO string
  total_amount: string;
  discount_amount: string;
  final_amount: string;
  status: 'pending' | 'preparing' | 'served' | 'completed' | 'cancelled' | 'refunded';
  payment_method: string | null;
  is_paid: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;

  // Dùng để hiển thị thêm thông tin trong UI
  customer_name?: string;
  table_name?: string;
  order_items?: OrderItem[];
}

// Dữ liệu từ backend (bao gồm cả quan hệ)
export interface OrderResponse {
  id: number;
  customer_id: number | null;
  table_id: number | null;
  guest_count: number | null;
  order_type: 'dine-in' | 'take-away' | 'delivery';
  order_date: string;
  total_amount: string;
  discount_amount: string;
  final_amount: string;
  status: 'pending' | 'preparing' | 'served' | 'completed' | 'cancelled' | 'refunded';
  payment_method: string | null;
  is_paid: boolean;
  note: string | null;
  created_at: string;
  updated_at: string;

  customer?: {
    id: number;
    user_info: {
      name: string;
      avatar: string | null;
    };
  };

  table?: {
    id: number;
    name: string;
    capacity: number;
  };

  order_items?: OrderItem[];
}

// Payload để tạo đơn hàng
export interface CreateOrderPayload {
  customer_id?: number;
  table_id?: number;
  guest_count?: number;
  order_type: 'dine-in' | 'take-away' | 'delivery';
  note?: string;
  order_date:string;
  order_items: {
    product_id: number;
    quantity: number;
    price?: number; // optional nếu server tự lấy từ DB
  }[];
}

// Payload để cập nhật trạng thái đơn hàng
export interface UpdateOrderStatusPayload {
  status: 'pending' | 'preparing' | 'served' | 'completed' | 'cancelled' | 'refunded';
}

// Payload để đánh dấu đã thanh toán
export interface MarkAsPaidPayload {
  method: string; // ví dụ: "cash", "credit_card", "momo"
}

// Payload để tìm kiếm đơn hàng
export interface SearchOrderQuery {
  keyword?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}
