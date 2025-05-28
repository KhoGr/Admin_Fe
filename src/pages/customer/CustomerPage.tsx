import React, { useEffect, useState } from 'react';
import { Typography, Input, Button, Modal, Form, Select, Space, Row, Col } from 'antd';
import CustomerTable from '../../components/customer/CustomerTable';
import { CustomerModel } from '../../types/Customer';
import customerApi from '../../api/customerApi';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/slices/message.slice';

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerPage: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const fetchAllCustomers = async () => {
    try {
      const data = await customerApi.getAll();
            console.log("data ",data)

      setCustomers(data.data);
    } catch (error) {
      dispatch(setMessage({ message: 'Không thể tải danh sách khách hàng', type: 'error' }));
    }
  };

  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) {
        fetchAllCustomers();
        return;
      }
      const data = await customerApi.searchByName(searchTerm);
      setCustomers(data);
    } catch (error) {
      dispatch(setMessage({ message: 'Không tìm thấy khách hàng', type: 'error' }));
    }
  };

  const handleReload = () => {
    fetchAllCustomers();
  };

  const handleDetail = (customer: CustomerModel) => {
    setSelectedCustomer(customer);

    form.setFieldsValue({
      name: customer.user_info?.name || '',
      username: customer.user_info?.username || '',
      email: customer.user_info?.account?.email || '',
      loyalty_point: customer.loyalty_point,
      total_spent: customer.total_spent,
      membership_level: customer.membership_level,
      note: customer.note || '',
    });

    setOpenDetail(true);
  };

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Danh sách khách hàng</Title>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col flex="auto">
            <Input
              placeholder="Tìm kiếm theo tên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Button onClick={handleSearch}>Tìm kiếm</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={handleReload}>
              Tải lại
            </Button>
          </Col>
        </Row>

        <CustomerTable customers={customers} onDetail={handleDetail} onReload={handleReload} />
      </Space>

      <Modal
        open={openDetail}
        title="Thông tin khách hàng"
        onCancel={() => setOpenDetail(false)}
        okText="Lưu"
        onOk={async () => {
          try {
            const values = await form.validateFields();
            if (!selectedCustomer?.user_info?.user_id) {
              dispatch(setMessage({ message: 'Không có ID người dùng!', type: 'error' }));
              return;
            }

            await customerApi.update(selectedCustomer.user_info.user_id, values);

            dispatch(setMessage({ message: 'Cập nhật khách hàng thành công!', type: 'success' }));
            setOpenDetail(false);
            fetchAllCustomers();
          } catch (error) {
            dispatch(setMessage({ message: 'Lỗi khi cập nhật khách hàng', type: 'error' }));
            console.error('Update error:', error);
          }
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Họ tên" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Tên đăng nhập" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Điểm tích lũy" name="loyalty_point">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Tổng chi tiêu" name="total_spent">
            <Input type="number" addonAfter="₫" />
          </Form.Item>
          {form.getFieldValue('total_spent') !== undefined && (
            <Text type="secondary">
              {Number(form.getFieldValue('total_spent')).toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </Text>
          )}
          <Form.Item label="Hạng" name="membership_level">
            <Select>
              <Option value="bronze">Bronze</Option>
              <Option value="silver">Silver</Option>
              <Option value="gold">Gold</Option>
              <Option value="platinum">Platinum</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerPage;
