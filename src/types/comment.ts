// Interface chính hiển thị comment trong UI
export interface Comment {
  id: string; // comment_id
  menuItemId: string; // item_id
  menuItemName: string; // MenuItem.name (populated)
  userId: string; // customer_id
  userName: string; // Customer.full_name (populated)
  rating: number;
  content: string;
  createdAt: Date;
}

// Payload khi tạo comment mới
export interface CreateCommentPayload {
  menuItemId: string; // item_id
  userId: string; // customer_id
  rating: number;
  content?: string;
}

// Payload khi cập nhật comment
export interface UpdateCommentPayload {
  rating: number;
  content?: string;
}

// Dữ liệu trả về cho mỗi comment trong danh sách
export interface CommentResponse {
  id: string;
  menuItemId: string;
  menuItemName: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string; // ISO string từ server
}

// Payload để tìm kiếm comment (optional các field)
export interface SearchCommentQuery {
  menuItemName?: string;
  userName?: string;
  rating?: number;
}
export interface CommentFormProps {
  initialData?: any;
  onSave: (data: CreateCommentPayload | UpdateCommentPayload) => Promise<void>;
  onCancel: () => void;
  preselectedMenuItemId?: string;
}