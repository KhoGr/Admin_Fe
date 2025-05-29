import { useEffect, useState } from "react";
import { Button, Tabs, Modal, Card, Table, Tooltip } from "antd";
import { PlusOutlined, StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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

const { TabPane } = Tabs;

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);
  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchComments();
    fetchMenuItems();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await commentApi.getAll();
      const formatted: Comment[] = res.data.map((c: CommentResponse) => ({
        ...c,
        createdAt: new Date(c.created_at),
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

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setIsOpen(true);
  };

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

  const viewMenuItem = (id: string) => {
    navigate(`/menu-items?highlight=${id}`);
  };

  const filteredComments = selectedMenuItemId
    ? comments.filter((c) => String(c.item_id) === selectedMenuItemId)
    : comments;

  const columns = [
    {
      title: "Menu Item",
      dataIndex: "menuItemName",
      key: "menuItemName",
      render: (_: any, record: Comment) => (
        <Button type="link" onClick={() => viewMenuItem(String(record.item_id))}>
          {record.menu_item_name || "Unnamed Item"}
        </Button>
      ),
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (_: any, record: Comment) => (
        <div>
          {[...Array(5)].map((_, i) => (
            <StarFilled
              key={i}
              style={{
                color: i < record.rating ? "#fadb14" : "#d9d9d9",
                fontSize: 14,
                marginRight: 2,
              }}
            />
          ))}
          <span style={{ marginLeft: 8 }}>{record.rating}/5</span>
        </div>
      ),
    },
    {
      title: "Comment",
      dataIndex: "content",
      key: "content",
      render: (text: string) => (
        <Tooltip title={text}>
          <div
            style={{
              maxWidth: 300,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date | string) => {
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleDateString();
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Comment) => (
        <Button size="small" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

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
          <Card>
            <Table
              columns={columns}
              dataSource={comments}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="By Menu Item" key="by-item">
          <Card>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
              {menuItems.map((item) => {
                const isSelected = selectedMenuItemId === item.item_id;
                return (
                  <Card
                    key={item.item_id}
                    hoverable
                    onClick={() =>
                      setSelectedMenuItemId((prev) =>
                        prev === item.item_id ? null : item.item_id
                      )
                    }
                    style={{
                      width: 250,
                      borderColor: isSelected ? "#1890ff" : undefined,
                      backgroundColor: isSelected ? "#e6f7ff" : undefined,
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <img
                        src={item.image_url}
                        alt={item.name}
                        width={48}
                        height={48}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/100x100/png?text=No+Image";
                        }}
                      />
                      <div>
                        <h4 style={{ marginBottom: 4 }}>{item.name}</h4>
                        <p style={{ fontSize: 12, color: "#888" }}>
                          {comments.filter((c) => String(c.item_id) === String(item.item_id)).length} comments
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {selectedMenuItemId ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3>
                    Comments for{" "}
                    {menuItems.find((m) => m.item_id === selectedMenuItemId)?.name}
                  </h3>
                  <Button
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => {
                      setEditingComment(null);
                      setIsOpen(true);
                    }}
                  >
                    Add Comment
                  </Button>
                </div>
                <Table
                  columns={columns}
                  dataSource={filteredComments}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "64px 0", color: "#aaa" }}>
                Select a menu item to view its comments
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Comments;
