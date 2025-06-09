import React from "react";
import { Typography, List, Tag, Space, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ChatbotResponse } from "../../types/chatbotResponse";

const { Title } = Typography;

interface ResponseTabProps {
  responses: ChatbotResponse[];
  onDelete: (responseId: number) => void;
}

const ResponseTab: React.FC<ResponseTabProps> = ({ responses, onDelete }) => {
  return (
    <div>
      <Title level={4}>Danh sách phản hồi của Chatbot</Title>

      <List
        itemLayout="vertical"
        dataSource={responses}
        renderItem={(item) => (
          <List.Item
            key={item.response_id}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <Space>
                  <strong>Keyword:</strong> {item.keyword}
                  {item.category && <Tag color="blue">{item.category}</Tag>}
                </Space>
              </div>
              <div>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xoá phản hồi này?"
                  onConfirm={() => onDelete(item.response_id)}
                  okText="Xoá"
                  cancelText="Huỷ"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    Xoá
                  </Button>
                </Popconfirm>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <p><strong>Trả lời:</strong> {item.response}</p>
              {item.ai_model && (
                <p>
                  <strong>Mô hình AI:</strong> {item.ai_model.name}
                </p>
              )}
              {item.menu_item && (
                <p>
                  <strong>Món ăn liên kết:</strong> {item.menu_item.name} - {item.menu_item.price.toLocaleString()}đ
                </p>
              )}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ResponseTab;
