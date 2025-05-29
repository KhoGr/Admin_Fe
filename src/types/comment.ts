// Interface chính hiển thị comment trong UI
export interface Comment {
  comment_id: number; // backend trả về comment_id
  item_id: number; // menu item ID
  menu_item_name: string;
  customer_id: number; // user ID (customer)
  user_name: string;
  rating: number;
  content: string;
  created_at: string; // ISO string từ server
}

// Payload khi tạo comment mới (snake_case để gửi tới backend)
export interface CreateCommentPayload {
  item_id: number;
  customer_id: number;
  rating: number;
  content?: string;
}

// Payload khi cập nhật comment
export interface UpdateCommentPayload {
  rating: number;
  content?: string;
}

// Dữ liệu trả về cho mỗi comment trong danh sách (đồng nhất với `Comment`)
export type CommentResponse = Comment;

// Payload để tìm kiếm comment (giữ nguyên vì là optional params ở frontend)
export interface SearchCommentQuery {
  menu_item_name?: string;
  user_name?: string;
  rating?: number;
}

// Props cho CommentForm
export interface CommentFormProps {
  initialData?: Partial<Comment>;
  onSave: (data: CreateCommentPayload | UpdateCommentPayload) => Promise<void>;
  onCancel: () => void;
  preselectedMenuItemId?: string;
}
