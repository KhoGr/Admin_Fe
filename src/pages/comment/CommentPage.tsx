import { useState, useEffect } from "react";
import { Button, Tabs, Modal, Card, Table, Tooltip } from "antd";
import { PlusOutlined, StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CommentForm } from "../../components/comments/CommentForm";
import { mockMenuItems } from "../../mock/mocks";
import { v4 as uuidv4 } from "uuid";

const { TabPane } = Tabs;

interface Comment {
  id: string;
  menuItemId: string;
  menuItemName: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: Date;
}

const LOCAL_STORAGE_KEY = "commentsData";

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored, (key, value) => {
        if (key === "createdAt") return new Date(value);
        return value;
      });
      setComments(parsed);
    } else {
      // initial load fallback
      setComments([]);
    }
  }, []);

  // Save to localStorage whenever comments change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setIsOpen(true);
  };

  const handleSave = (comment: Omit<Comment, "id" | "createdAt">) => {
    let newComments;
    if (editingComment) {
      // update
      newComments = comments.map((c) =>
        c.id === editingComment.id ? { ...editingComment, ...comment } : c
      );
    } else {
      // add
      newComments = [
        {
          ...comment,
          id: uuidv4(),
          createdAt: new Date(),
        },
        ...comments,
      ];
    }

    setComments(newComments);
    setIsOpen(false);
    setEditingComment(null);
    toast.success(`Comment ${editingComment ? "updated" : "added"} successfully.`);
  };

  const viewMenuItem = (menuItemId: string) => {
    navigate(`/menu-items?highlight=${menuItemId}`);
  };

  const filteredComments = selectedMenuItemId
    ? comments.filter((comment) => comment.menuItemId === selectedMenuItemId)
    : comments;

  const columns = [
    {
      title: "Menu Item",
      dataIndex: "menuItemName",
      key: "menuItemName",
      render: (_: any, record: Comment) => (
        <Button type="link" onClick={() => viewMenuItem(record.menuItemId)}>
          {record.menuItemName}
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
      render: (date: Date) => new Date(date).toLocaleDateString(),
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
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Comments</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsOpen(true);
            setEditingComment(null);
          }}
        >
          Add Comment
        </Button>
      </div>

      <Modal
        open={isOpen}
        title={editingComment ? "Edit Comment" : "Add Comment"}
        footer={null}
        onCancel={() => setIsOpen(false)}
        destroyOnClose
      >
        <CommentForm
          initialData={editingComment || null}
          onSave={handleSave}
          onCancel={() => setIsOpen(false)}
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
              {mockMenuItems.map((item) => (
                <Card
                  key={item.id}
                  hoverable
                  style={{
                    width: 250,
                    borderColor: selectedMenuItemId === item.id ? "#1890ff" : undefined,
                    backgroundColor: selectedMenuItemId === item.id ? "#e6f7ff" : undefined,
                  }}
                  onClick={() => setSelectedMenuItemId(item.id)}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      style={{ objectFit: "cover", borderRadius: 4 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/100x100/png?text=No+Image";
                      }}
                    />
                    <div>
                      <h4 style={{ marginBottom: 4 }}>{item.name}</h4>
                      <p style={{ fontSize: 12, color: "#888" }}>
                        {comments.filter((c) => c.menuItemId === item.id).length} comments
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {selectedMenuItemId ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3>Comments for {mockMenuItems.find((m) => m.id === selectedMenuItemId)?.name}</h3>
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
              </div>
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
