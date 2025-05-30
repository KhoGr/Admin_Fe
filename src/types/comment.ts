// Interface chính hiển thị comment trong UI
export interface Comment {
  comment_id: number;
  item_id: number;
  customer_id: number;
  rating: number;
  comment: string;
  created_at: string; // ISO string
  updated_at: string;

  // Phát sinh thêm để hiển thị trong UI
  menu_item_name: string;
  user_name: string;
}

// Dữ liệu trả về từ backend
export interface CommentResponse {
  comment_id: number;
  item_id: number;
  customer_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;

  commenter: {
    customer_id: number;
    user_id: number;
    loyalty_point: number;
    total_spent: string;
    membership_level: string;
    note: string;
    created_at: string;
    updated_at: string;
    user_info: {
      name: string;
      avatar: string | null;
    };
  };

  commented_item: {
    name: string;
  };
}

// Payload khi tạo comment mới
export interface CreateCommentPayload {
  item_id: number;
  customer_id: number;
  rating: number;
  comment?: string;
}

// Payload khi cập nhật comment
export interface UpdateCommentPayload {
  rating: number;
  comment?: string;
}

// Payload để tìm kiếm comment
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
