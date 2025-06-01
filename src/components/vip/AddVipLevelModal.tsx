import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Row, Col } from 'antd';
import { CreateVipLevelDto } from '../../types/vip';

interface AddVipLevelModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateVipLevelDto & { id?: number }) => void;
  initialValues?: Partial<CreateVipLevelDto & { id?: number }>;
}

const formatVND = (value: string | number): string => {
  const number = typeof value === 'string' ? parseInt(value.replace(/\D/g, '') || '0') : value;
  return new Intl.NumberFormat('vi-VN').format(number);
};

const parseVND = (value: string): string => {
  return value.replace(/\D/g, '') || '0';
};

const AddVipLevelModal: React.FC<AddVipLevelModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        min_total_spent: formatVND(initialValues.min_total_spent || 0),
        free_shipping_threshold: formatVND(initialValues.free_shipping_threshold || 0),
      });
    } else if (open) {
      form.resetFields();
    }
  }, [initialValues, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const cleanedValues = {
        ...values,
        min_total_spent: Number(parseVND(values.min_total_spent)),
        free_shipping_threshold: Number(parseVND(values.free_shipping_threshold || '0')),
      };
      const id = initialValues?.id;
      onSubmit(id ? { ...cleanedValues, id } : cleanedValues);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCurrencyChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = parseVND(raw);
    const formatted = formatVND(parsed);
    form.setFieldValue(fieldName, formatted);
  };

  return (
    <Modal
      title={initialValues ? 'Cập nhật cấp độ VIP' : 'Thêm cấp độ VIP'}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="name" label="Tên cấp độ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="min_total_spent"
          label="Tổng chi tiêu tối thiểu"
          rules={[{ required: true }]}
        >
          <Input
            addonAfter="₫"
            onChange={(e) => handleCurrencyChange('min_total_spent', e)}
          />
        </Form.Item>

        <Form.Item
          name="discount_percent"
          label="Phần trăm giảm giá"
          rules={[{ required: true }]}
        >
          <Input type="number" min={0} max={100} />
        </Form.Item>

        <Form.Item shouldUpdate={(prev, curr) =>
          prev.benefits?.freeDelivery !== curr.benefits?.freeDelivery
        }>
          {({ getFieldValue }) => (
            <Form.Item
              name="free_shipping_threshold"
              label="Ngưỡng miễn phí vận chuyển"
              rules={[
                {
                  validator: (_, value) => {
                    const isFreeDelivery = getFieldValue(['benefits', 'freeDelivery']);
                    if (!isFreeDelivery && value) {
                      return Promise.reject(
                        new Error('Bật "Giao hàng miễn phí" để nhập ngưỡng')
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                addonAfter="₫"
                disabled={!getFieldValue(['benefits', 'freeDelivery'])}
                onChange={(e) => handleCurrencyChange('free_shipping_threshold', e)}
              />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item label="Quyền lợi">
          <Row gutter={[16, 12]}>
            <Col span={12}>
              <Form.Item name={['benefits', 'freeDelivery']} valuePropName="checked" noStyle>
                <Switch checkedChildren="Giao hàng miễn phí" unCheckedChildren="Không miễn phí" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name={['benefits', 'prioritySupport']} valuePropName="checked" noStyle>
                <Switch checkedChildren="Hỗ trợ ưu tiên" unCheckedChildren="Hỗ trợ thường" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name={['benefits', 'notifyPromotions']} valuePropName="checked" noStyle>
                <Switch checkedChildren="Thông báo khuyến mãi" unCheckedChildren="Không thông báo" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name={['benefits', 'priorityReservation']} valuePropName="checked" noStyle>
                <Switch checkedChildren="Ưu tiên đặt bàn" unCheckedChildren="Đặt bàn thường" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name={['benefits', 'freeDessert']} valuePropName="checked" noStyle>
                <Switch checkedChildren="Tặng tráng miệng" unCheckedChildren="Không tặng" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVipLevelModal;
