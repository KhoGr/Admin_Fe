// src/components/staff/AddStaffModal.tsx
import React from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const { Option } = Select;

interface AddStaffModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  form: any;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({ open, onCancel, onSubmit, form }) => {
  return (
    <Modal
      open={open}
      title="Thêm nhân viên mới"
      onCancel={onCancel}
      okText="Thêm"
      onOk={onSubmit}
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Họ tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item label="Chức vụ" name="position" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

<Form.Item label="Lương" name="salary" rules={[{ required: true }]}>
  <InputNumber
    style={{ width: '100%' }}
    min={0}
    addonAfter="₫"
    formatter={(value?: string | number) =>
      value ? `${Number(value).toLocaleString('vi-VN')}` : ''
    }
    parser={(value?: string) =>
      value ? parseFloat(value.replace(/[₫,.\s]/g, '')) : 0
    }
  />
</Form.Item>



        <Form.Item label="Hình thức làm việc" name="working_type">
          <Select defaultValue="fulltime">
            <Option value="fulltime">Full-time</Option>
            <Option value="parttime">Part-time</Option>
            <Option value="intern">Thực tập</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ngày vào làm" name="joined_date">
          <Input type="date" />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStaffModal;
