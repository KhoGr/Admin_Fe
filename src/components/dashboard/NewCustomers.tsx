import { Card, Progress, Typography, Avatar } from "antd";
import { Icon } from "@iconify/react";

const { Text } = Typography;

const NewCustomers = () => {
  return (
    <Card bordered={false} style={{ borderRadius: "12px" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* flex: sắp xếp các phần tử theo hàng và côt */}
        {/* mg:margin bottom */}
        <Avatar
          size={40}
          style={{ backgroundColor: "#FF8C00", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Icon icon="solar:football-outline" height={24} color="white" />
        </Avatar>
        <Text strong style={{ fontSize: "16px" }}>
          New Customers
        </Text>
      </div>

      <div className="flex items-center justify-between mb-3">
        <Text type="secondary" style={{ fontSize: "14px" }}>
          New goals
        </Text>
        <Text strong style={{ fontSize: "14px" }}>
          83%
        </Text>
      </div>

      {/* Progress Bar */}
      <Progress percent={83} status="active" strokeColor="#FF8C00" />
    </Card>
  );
};

export default NewCustomers;
