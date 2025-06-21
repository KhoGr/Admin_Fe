import React, { useState } from 'react';
import { Modal, Form, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import monthlyFinanceApi from '../../api/monthlyFinanceApi';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // callback để refetch lại data sau khi tạo xong
}

const AddMonthlySummaryModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const selectedMonth: Dayjs = values.month;
      const monthStr = selectedMonth.format('YYYY-MM');

      setLoading(true);
      await monthlyFinanceApi.create({ month: monthStr });
      message.success(`Tổng hợp dữ liệu tháng ${monthStr} thành công`);
      form.resetFields();
      onClose();
      onSuccess(); // gọi callback để reload table
    } catch (error) {
      message.error('Không thể tạo bản ghi tháng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo tổng hợp tháng"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Tạo"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Chọn tháng"
          name="month"
          rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}
        >
          <DatePicker picker="month" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMonthlySummaryModal;
