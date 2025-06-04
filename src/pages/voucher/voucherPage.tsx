import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Switch,
} from 'antd';
import dayjs from 'dayjs';
import VoucherTable from '../../components/voucher/VoucherTable';
import { Voucher } from '../../types/voucher';
import voucherApi from '../../api/voucherApi';
import { useSearchParams } from 'react-router-dom';

const { Option } = Select;

const VoucherPage: React.FC = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const voucherId = searchParams.get('id');

  const fetchAllVouchers = async () => {
    try {
      const res = await voucherApi.getAll();
      setAllVouchers(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách voucher');
    }
  };

  useEffect(() => {
    fetchAllVouchers();
  }, []);

  useEffect(() => {
    if (voucherId && allVouchers.length > 0) {
      const found = allVouchers.find((v) => v.voucher_id === Number(voucherId));
      if (found) {
        setEditingVoucher(found);
        form.setFieldsValue({
          ...found,
          value: found.type === 'percent'
            ? `${found.value}%`
            : new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
              }).format(found.value),
          expires_at: found.expires_at ? dayjs(found.expires_at) : null,
        });
        setVisible(true);
      } else {
        message.error('Không tìm thấy voucher');
      }
    }
  }, [voucherId, allVouchers]);

  const handleOpenCreate = () => {
    form.resetFields();
    setEditingVoucher(null);
    setVisible(true);
    setSearchParams({});
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const rawValue = (values.value || '').toString().replace(/[^\d]/g, '');
      const numericValue = Number(rawValue);

      if (values.type === 'percent' && numericValue >= 50) {
        message.error('Giảm giá theo % không được vượt quá 50%');
        return;
      }

      const dto = {
        code: values.code,
        type: values.type,
        value: numericValue,
        usage_limit: values.usage_limit || null,
        usage_limit_per_user: values.usage_limit_per_user || null,
        expires_at: values.expires_at?.toISOString() || null,
        is_active: values.is_active ?? true,
      };

      setLoading(true);
      if (editingVoucher) {
        await voucherApi.update(editingVoucher.voucher_id, dto);
        message.success('Cập nhật thành công');
      } else {
        await voucherApi.create(dto);
        message.success('Tạo mới thành công');
      }

      setVisible(false);
      setSearchParams({});
      fetchAllVouchers();
    } catch (err) {
      message.error('Lỗi xử lý dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Quản lý Voucher</h1>
        <Button type="primary" onClick={handleOpenCreate}>
          Thêm Voucher
        </Button>
      </div>

      <VoucherTable data={allVouchers} reload={fetchAllVouchers} />

      <Modal
        title={editingVoucher ? 'Cập nhật Voucher' : 'Tạo Voucher mới'}
        open={visible}
        onCancel={() => {
          setVisible(false);
          setSearchParams({});
        }}
        onOk={handleSubmit}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Mã voucher" rules={[{ required: true }]}>
            <Input placeholder="VD: SUMMER2025" />
          </Form.Item>

          <Form.Item name="type" label="Loại giảm giá" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại">
              <Option value="flat">Giảm số tiền</Option>
              <Option value="percent">Giảm theo %</Option>
            </Select>
          </Form.Item>

          <Form.Item shouldUpdate={(prev, cur) => prev.type !== cur.type} noStyle>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              return (
                <Form.Item
                  name="value"
                  label="Giá trị"
                  rules={[
                    { required: true, message: 'Vui lòng nhập giá trị' },
                    () => ({
                      validator(_, value) {
                        const raw = Number((value || '').toString().replace(/[^\d]/g, ''));
                        if (isNaN(raw) || raw <= 0) {
                          return Promise.reject(new Error('Giá trị phải là số > 0'));
                        }
                        if (type === 'percent' && raw >= 50) {
                          return Promise.reject(new Error('Phần trăm không được vượt quá 50%'));
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder={type === 'percent' ? 'VD: 10%' : 'VD: 10000₫'}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d]/g, '');
                      const formatted =
                        type === 'percent'
                          ? `${raw}%`
                          : new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                              maximumFractionDigits: 0,
                            }).format(Number(raw));
                      form.setFieldsValue({ value: formatted });
                    }}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item name="usage_limit" label="Giới hạn lượt dùng">
            <Input type="number" min={1} placeholder="Không giới hạn nếu bỏ trống" />
          </Form.Item>

          <Form.Item name="usage_limit_per_user" label="Giới hạn mỗi người">
            <Input type="number" min={1} placeholder="Không giới hạn nếu bỏ trống" />
          </Form.Item>

          <Form.Item name="expires_at" label="Hạn sử dụng">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="is_active" label="Trạng thái" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Kích hoạt" unCheckedChildren="Tạm ngưng" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherPage;
