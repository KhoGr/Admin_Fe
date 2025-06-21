import { Typography, Row, Col, Card, Space, Button } from "antd";
import {
  SmileOutlined,
  TeamOutlined,
  CoffeeOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Dashboard = () => {
  return (
    <div style={{ padding: 32 }}>
      <Title level={2}>👋 Chào mừng đến với hệ thống quản lý nhà hàng</Title>
      <Text type="secondary">
        Đây là bảng điều khiển trung tâm của bạn. Bạn có thể quản lý thực đơn, nhân viên,
        đơn hàng, và nhiều hơn nữa.
      </Text>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{ textAlign: "center" }}
            cover={<SmileOutlined style={{ fontSize: 40, color: "#1890ff", marginTop: 16 }} />}
          >
            <Title level={4}>Khách hàng</Title>
            <Text>Quản lý danh sách khách, VIP, đánh giá món ăn</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{ textAlign: "center" }}
            cover={<TeamOutlined style={{ fontSize: 40, color: "#52c41a", marginTop: 16 }} />}
          >
            <Title level={4}>Nhân viên</Title>
            <Text>Thông tin, lịch làm việc, chấm công</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{ textAlign: "center" }}
            cover={<CoffeeOutlined style={{ fontSize: 40, color: "#fa8c16", marginTop: 16 }} />}
          >
            <Title level={4}>Thực đơn</Title>
            <Text>Quản lý món ăn, combo, khuyến mãi</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{ textAlign: "center" }}
            cover={<SettingOutlined style={{ fontSize: 40, color: "#722ed1", marginTop: 16 }} />}
          >
            <Title level={4}>Cài đặt</Title>
            <Text>Thông tin nhà hàng, phân quyền, thanh toán</Text>
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <Space>
          <Button type="primary" size="large">
            Bắt đầu quản lý
          </Button>
          <Button size="large">Xem hướng dẫn</Button>
        </Space>
      </div>
    </div>
  );
};

export default Dashboard;
