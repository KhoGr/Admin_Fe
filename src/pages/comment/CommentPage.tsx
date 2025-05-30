import { useEffect, useState } from "react";
import { Button, Tabs, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { CommentForm } from "../../components/comments/CommentForm";
import {
  Comment,
  CommentResponse,
  CreateCommentPayload,
  UpdateCommentPayload,
} from "../../types/comment";
import commentApi from "../../api/commentApi";
import menuItemApi from "../../api/menuItemApi";
import { MenuItem } from "../../types/menuItem";
import { RootState } from "../../redux/store";
import AllCommentsTab from "../../components/comments/AllCommentsTab";
import CommentsByMenuItemTab from "../../components/comments/CommentsByMenuItemTab";

const { TabPane } = Tabs;

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);

  const auth = useSelector((state: RootState) => state.auth);

  const fetchComments = async () => {
    try {
      const res = await commentApi.getAll();
      const formatted: Comment[] = res.data.map((c: CommentResponse) => ({
        comment_id: c.comment_id,
        item_id: c.item_id,
        customer_id: c.customer_id,
        rating: c.rating,
        comment: c.comment,
        created_at: c.created_at,
        updated_at: c.updated_at,
        menu_item_name: c.commented_item?.name || "Unnamed Item",
        user_name: c.commenter?.user_info?.name || "Anonymous",
      }));
      setComments(formatted);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await menuItemApi.getAll();
      setMenuItems(res.data || []);
    } catch {
      toast.error("Failed to load menu items");
    }
  };

  useEffect(() => {
    fetchComments();
    fetchMenuItems();
  }, []);

  const handleSave = async (data: CreateCommentPayload | UpdateCommentPayload) => {
    try {
      if (editingComment) {
        await commentApi.update(String(editingComment.comment_id), data as UpdateCommentPayload);
        toast.success("Comment updated successfully.");
      } else {
        const payload: CreateCommentPayload = {
          ...(data as CreateCommentPayload),
          item_id: (data as CreateCommentPayload).item_id ?? selectedMenuItemId ?? "",
          customer_id: Number(auth.user?.id ?? 1),
        };
        await commentApi.create(payload);
        toast.success("Comment added successfully.");
      }
      setIsOpen(false);
      setEditingComment(null);
      fetchComments();
    } catch {
      toast.error("Failed to save comment");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await commentApi.delete(commentId);
      toast.success("Comment deleted successfully.");
      fetchComments();
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const handleSearch = async (filters: {
    itemName?: string;
   customerId?: number;
    rating?: number;
  }) => {
    try {
      const res = await commentApi.search(filters);
      const formatted: Comment[] = res.data.map((c: CommentResponse) => ({
        comment_id: c.comment_id,
        item_id: c.item_id,
        customer_id: c.customer_id,
        rating: c.rating,
        comment: c.comment,
        created_at: c.created_at,
        updated_at: c.updated_at,
        menu_item_name: c.commented_item?.name || "Unnamed Item",
        user_name: c.commenter?.user_info?.name || "Anonymous",
      }));
      setComments(formatted);
    } catch {
      toast.error("Failed to search comments");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Comments</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingComment(null);
            setIsOpen(true);
          }}
        >
          Add Comment
        </Button>
      </div>

      <Modal
        open={isOpen}
        title={editingComment ? "Edit Comment" : "Add Comment"}
        footer={null}
        onCancel={() => {
          setIsOpen(false);
          setEditingComment(null);
        }}
        destroyOnClose
      >
        <CommentForm
          initialData={editingComment || undefined}
          onSave={handleSave}
          onSuccess={() => {
            setIsOpen(false);
            setEditingComment(null);
            fetchComments();
          }}
          onCancel={() => {
            setIsOpen(false);
            setEditingComment(null);
          }}
          preselectedMenuItemId={selectedMenuItemId || undefined}
        />
      </Modal>

      <Tabs defaultActiveKey="all">
        <TabPane tab="All Comments" key="all">
          <AllCommentsTab
            comments={comments}
            onEdit={(comment) => {
              setEditingComment(comment);
              setIsOpen(true);
            }}
            setIsOpen={setIsOpen}
            onDelete={handleDelete}
            onSearch={handleSearch}
          />
        </TabPane>
        <TabPane tab="By Menu Item" key="by-item">
          <CommentsByMenuItemTab
            comments={comments}
            menuItems={menuItems}
            selectedMenuItemId={selectedMenuItemId}
            setSelectedMenuItemId={setSelectedMenuItemId}
            onEdit={(comment) => {
              setEditingComment(comment);
              setIsOpen(true);
            }}
            setIsOpen={setIsOpen}
            onDelete={handleDelete}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Comments;
