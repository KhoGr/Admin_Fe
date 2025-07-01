import React from "react";
import { Typography, Row, Col, Card, Space, Button } from "antd";
import {
  SmileOutlined,
  TeamOutlined,
  CoffeeOutlined,
  SettingOutlined,
  FileTextOutlined,
  CommentOutlined,
  CrownOutlined,
  GiftOutlined,
  ScheduleOutlined,
  QrcodeOutlined,
  ShoppingCartOutlined,
  DatabaseOutlined,
  DollarOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 32 }}>
      <Title level={2}>👋 Chào mừng đến với hệ thống quản lý nhà hàng của những Ninja </Title>
      <Text type="secondary">
        Đây là bảng điều khiển trung tâm của bạn. Bạn có thể quản lý thực đơn,
        nhân viên, đơn hàng, và nhiều hơn nữa.
      </Text>

      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/customer")}
            style={{ textAlign: "center" }}
            cover={
              <SmileOutlined
                style={{ fontSize: 40, color: "#1890ff", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Khách hàng</Title>
            <Text>Quản lý khách, VIP, đánh giá món ăn</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/staff")}
            style={{ textAlign: "center" }}
            cover={
              <TeamOutlined
                style={{ fontSize: 40, color: "#52c41a", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Nhân viên</Title>
            <Text>Thông tin, chấm công, lương</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/menu-item")}
            style={{ textAlign: "center" }}
            cover={
              <CoffeeOutlined
                style={{ fontSize: 40, color: "#fa8c16", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Thực đơn</Title>
            <Text>Quản lý món ăn, combo, khuyến mãi</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/order")}
            style={{ textAlign: "center" }}
            cover={
              <ShoppingCartOutlined
                style={{ fontSize: 40, color: "#eb2f96", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Đơn hàng</Title>
            <Text>Quản lý đơn, trạng thái và thanh toán</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/comment")}
            style={{ textAlign: "center" }}
            cover={
              <CommentOutlined
                style={{ fontSize: 40, color: "#13c2c2", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Đánh giá</Title>
            <Text>Quản lý nhận xét và phản hồi</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/vip")}
            style={{ textAlign: "center" }}
            cover={
              <CrownOutlined
                style={{ fontSize: 40, color: "#722ed1", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>VIP</Title>
            <Text>Quản lý cấp độ và quyền lợi VIP</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/voucher")}
            style={{ textAlign: "center" }}
            cover={
              <GiftOutlined
                style={{ fontSize: 40, color: "#fa541c", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Voucher</Title>
            <Text>Chương trình giảm giá và khuyến mãi</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/work-schedule")}
            style={{ textAlign: "center" }}
            cover={
              <ScheduleOutlined
                style={{ fontSize: 40, color: "#2f54eb", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Lịch làm việc</Title>
            <Text>Xem và phân ca cho nhân viên</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/attendance")}
            style={{ textAlign: "center" }}
            cover={
              <FileTextOutlined
                style={{ fontSize: 40, color: "#faad14", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Chấm công</Title>
            <Text>Theo dõi thời gian làm việc</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/payroll")}
            style={{ textAlign: "center" }}
            cover={
              <DollarOutlined
                style={{ fontSize: 40, color: "#389e0d", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Lương</Title>
            <Text>Tính toán bảng lương nhân viên</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/inventory")}
            style={{ textAlign: "center" }}
            cover={
              <DatabaseOutlined
                style={{ fontSize: 40, color: "#722ed1", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Kho hàng</Title>
            <Text>Quản lý lô hàng, nguyên liệu</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/qr")}
            style={{ textAlign: "center" }}
            cover={
              <QrcodeOutlined
                style={{ fontSize: 40, color: "#434343", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>QR Code</Title>
            <Text>Tạo mã bàn hoặc thanh toán</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/chatbot")}
            style={{ textAlign: "center" }}
            cover={
              <RobotOutlined
                style={{ fontSize: 40, color: "#13c2c2", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Chatbot</Title>
            <Text>Hỗ trợ AI và trả lời nhanh</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            onClick={() => navigate("/admin/settings")}
            style={{ textAlign: "center" }}
            cover={
              <SettingOutlined
                style={{ fontSize: 40, color: "#d46b08", marginTop: 16 }}
              />
            }
          >
            <Title level={4}>Cài đặt</Title>
            <Text>Thông tin nhà hàng, phân quyền</Text>
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <Space>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/admin/order")}
          >
            Bắt đầu quản lý
          </Button>
          <Button size="large" onClick={() => navigate("/dashboard")}>
            Xem hướng dẫn
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Dashboard;
