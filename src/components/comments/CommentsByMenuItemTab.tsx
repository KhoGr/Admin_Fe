import { Card, Table, Button, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Comment } from '../../types/comment';
import { MenuItem } from '../../types/menuItem';

type Props = {
  comments: Comment[];
  menuItems: MenuItem[];
  selectedMenuItemId: string | null;
  setSelectedMenuItemId: (id: string | null) => void;
  onEdit: (comment: Comment | null) => void;
  setIsOpen: (open: boolean) => void;
  onDelete: (commentId: string) => void;
};

const CommentsByMenuItemTab = ({
  comments,
  menuItems,
  selectedMenuItemId,
  setSelectedMenuItemId,
  onEdit,
  setIsOpen,
  onDelete,
}: Props) => {
  // ✅ Fix: so sánh item_id sau khi ép kiểu để đảm bảo hoạt động đúng
  const filteredComments = selectedMenuItemId
    ? comments.filter((c) => String(c.item_id) === String(selectedMenuItemId))
    : [];

  const columns = [
    {
      title: 'User',
      dataIndex: 'user_name',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
    },
    {
      title: 'Actions',
      render: (_: any, record: Comment) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              onEdit(record);
              setIsOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this comment?"
            onConfirm={() => onDelete(String(record.comment_id))}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        {menuItems.map((item) => {
          const isSelected = String(selectedMenuItemId) === String(item.item_id);
          const commentCount = comments.filter(
            (c: Comment) => String(c.item_id) === String(item.item_id)
          ).length;

          return (
            <Card
              key={item.item_id}
              hoverable
              onClick={() =>
                setSelectedMenuItemId(
                  isSelected ? null : String(item.item_id)
                )
              }
              style={{
                width: 250,
                borderColor: isSelected ? '#1890ff' : undefined,
                backgroundColor: isSelected ? '#e6f7ff' : undefined,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  width={48}
                  height={48}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
                <div>
                  <h4>{item.name}</h4>
                  <p style={{ fontSize: 12, color: '#888' }}>
                    {commentCount} comments
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedMenuItemId ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3>
              Comments for{' '}
              {menuItems.find((m) => String(m.item_id) === String(selectedMenuItemId))?.name}
            </h3>
            <Button
              icon={<PlusOutlined />}
              size="small"
              onClick={() => {
                onEdit(null);
                setIsOpen(true);
              }}
            >
              Add Comment
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={filteredComments}
            rowKey="comment_id"
            pagination={{ pageSize: 5 }}
          />
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 0', color: '#aaa' }}>
          Select a menu item to view its comments
        </div>
      )}
    </Card>
  );
};

export default CommentsByMenuItemTab;
