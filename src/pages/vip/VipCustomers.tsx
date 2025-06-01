import React, { useEffect, useState } from 'react';
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Space,
  Button,
} from 'antd';
import {
  CrownOutlined,
  StarOutlined,
  RiseOutlined,
  UserOutlined,
  GiftOutlined,
  TruckOutlined,
  CustomerServiceOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons';
import vipApi from '../../api/vipApi';
import { VipLevel, CreateVipLevelDto, VipLevelTableRecord, VipBenefits } from '../../types/vip';
import AddVipLevelModal from '../../components/vip/AddVipLevelModal';
import { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

const formatVND = (value: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

const VipCustomersPage: React.FC = () => {
  const [vipLevels, setVipLevels] = useState<VipLevel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVip, setEditingVip] = useState<VipLevel | null>(null);

  const fetchVipLevels = async () => {
    setLoading(true);
    try {
      const response = await vipApi.getAll();
      setVipLevels(response.data);
    } catch (error) {
      console.error('Failed to fetch VIP levels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVipLevels();
  }, []);

  const handleSubmitVip = async (data: CreateVipLevelDto & { id?: number }) => {
    try {
      if (data.id) {
        await vipApi.update(data.id, data);
      } else {
        await vipApi.create(data);
      }
      setIsModalOpen(false);
      setEditingVip(null);
      fetchVipLevels();
    } catch (error) {
      console.error('Save VIP level failed:', error);
    }
  };

  const handleEdit = (vip: VipLevel) => {
    setEditingVip(vip);
    setIsModalOpen(true);
  };

  const getVipIcon = (levelName: string) => {
    switch (levelName) {
      case 'Diamond':
        return <CrownOutlined style={{ color: '#722ed1' }} />;
      case 'Gold':
        return <StarOutlined style={{ color: '#faad14' }} />;
      case 'Silver':
        return <RiseOutlined style={{ color: '#8c8c8c' }} />;
      case 'Bronze':
        return <UserOutlined style={{ color: '#d46b08' }} />;
      default:
        return <GiftOutlined />;
    }
  };

  const getVipColor = (levelName: string) => {
    switch (levelName) {
      case 'Diamond':
        return 'purple';
      case 'Gold':
        return 'gold';
      case 'Silver':
        return 'silver';
      case 'Bronze':
        return 'orange';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<VipLevelTableRecord> = [
    {
      title: 'Cấp độ VIP',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Tag color={getVipColor(text)}>{text}</Tag>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Tổng chi tiêu tối thiểu',
      dataIndex: 'min_total_spent',
      key: 'min_total_spent',
      render: (value: number) => formatVND(value),
    },
    {
      title: 'Phần trăm giảm giá',
      dataIndex: 'discount_percent',
      key: 'discount_percent',
      render: (value: number) => `${value}%`,
    },
    {
      title: 'Ngưỡng miễn phí vận chuyển',
      dataIndex: 'free_shipping_threshold',
      key: 'free_shipping_threshold',
      render: (value: number | null) =>
        value ? formatVND(value) : 'Không áp dụng',
    },
    {
      title: 'Quyền lợi',
      dataIndex: 'benefits',
      key: 'benefits',
      render: (benefits: VipBenefits | null) => {
        if (!benefits) return 'Không có';
        return (
          <Space>
            {benefits.freeDelivery && <TruckOutlined />}
            {benefits.prioritySupport && <CustomerServiceOutlined />}
            {benefits.monthlyVouchers && (
              <span>
                <GiftOutlined /> {benefits.monthlyVouchers} voucher/tháng
              </span>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: VipLevelTableRecord) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={4}>Thống kê khách hàng VIP</Title>

      <Row gutter={[16, 16]}>
        {vipLevels.map((level) => (
          <Col xs={24} sm={12} md={6} key={level.id}>
            <Card>
              <Space direction="vertical">
                <Space>
                  {getVipIcon(level.name)}
                  <span>{level.name}</span>
                </Space>
                <Statistic title="Giảm giá" value={level.discount_percent} suffix="%" />
                <Statistic title="Chi tiêu tối thiểu" value={formatVND(level.min_total_spent)} />
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row justify="space-between" align="middle" style={{ marginTop: 32 }}>
        <Title level={5}>Danh sách cấp độ VIP</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingVip(null);
            setIsModalOpen(true);
          }}
        >
          Thêm cấp độ VIP
        </Button>
      </Row>

      <Table
        columns={columns}
        dataSource={vipLevels}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <AddVipLevelModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingVip(null);
        }}
        onSubmit={handleSubmitVip}
        initialValues={
          editingVip
            ? {
                ...editingVip,
                free_shipping_threshold:
                  editingVip.free_shipping_threshold === null
                    ? undefined
                    : editingVip.free_shipping_threshold,
                benefits:
                  editingVip.benefits === null
                    ? undefined
                    : editingVip.benefits,
              }
            : undefined
        }
      />
    </div>
  );
};

export default VipCustomersPage;
