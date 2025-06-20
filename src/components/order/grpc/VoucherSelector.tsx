import React, { useEffect, useState } from 'react';
import { Form, Select, Typography } from 'antd';
import voucherApi from '../../../api/voucherApi';

const { Option } = Select;
const { Text } = Typography;

type Voucher = {
  voucher_id: number;
  code: string;
  type: 'flat' | 'percent';
  value: string;
};

type Props = {
  form: any;
  onChange: (value: { voucher_id: number; discount_amount: number, type: 'flat' | 'percent' } | null) => void;
};

const VoucherSelector = ({ form, onChange }: Props) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [discountText, setDiscountText] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    voucherApi
      .getAll()
      .then((res) => {
        setVouchers(
          res.data.map((v: any) => ({
            ...v,
            value: String(v.value),
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const calculateDiscount = (voucher: Voucher, total: number) => {
    const value = parseFloat(voucher.value);
    let discountAmount = 0;
    let display = '';

    if (voucher.type === 'flat') {
      discountAmount = value;
      display = `Giảm ${value.toLocaleString('vi-VN')} ₫`;
    } else if (voucher.type === 'percent') {
      discountAmount = (total * value) / 100;
      display = `Giảm ${value}% ~ ${discountAmount.toLocaleString('vi-VN')} ₫`;
    }

    return { discountAmount, display };
  };

  const handleSelect = (voucher_id: number) => {
    const selected = vouchers.find((v) => v.voucher_id === voucher_id);
    if (!selected) return;

    const total = form.getFieldValue('totalAmount') || 0;
    const { discountAmount, display } = calculateDiscount(selected, total);

    form.setFieldsValue({
      voucher_id: selected.voucher_id,
      discount_amount: discountAmount,
    });

    setDiscountText(display);
    onChange?.({ voucher_id: selected.voucher_id, discount_amount: discountAmount, type: selected.type });
  };

  // Cập nhật lại nếu totalAmount thay đổi và voucher đang chọn là %.
  useEffect(() => {
    const voucher_id = form.getFieldValue('voucher_id');
    const total = form.getFieldValue('totalAmount') || 0;
    const selected = vouchers.find((v) => v.voucher_id === voucher_id);

    if (selected && selected.type === 'percent') {
      const { discountAmount, display } = calculateDiscount(selected, total);
      form.setFieldsValue({ discount_amount: discountAmount });
      setDiscountText(display);
      onChange?.({ voucher_id: selected.voucher_id, discount_amount: discountAmount, type: selected.type });
    }
  }, [form.getFieldValue('totalAmount')]);

  return (
    <>
      <Form.Item name="voucher_id" label="Mã giảm giá">
        <Select
          placeholder="Chọn mã giảm giá"
          loading={loading}
          onSelect={handleSelect}
          allowClear
          onClear={() => {
            form.setFieldsValue({ voucher_id: null, discount_amount: 0 });
            setDiscountText('');
            onChange?.(null);
          }}
        >
          {vouchers.length === 0 ? (
            <Option value={0} disabled>
              Không có mã giảm giá khả dụng
            </Option>
          ) : (
            vouchers.map((v) => (
              <Option key={v.voucher_id} value={v.voucher_id}>
                {v.code} ({v.type === 'flat' ? `-${parseInt(v.value).toLocaleString('vi-VN')}₫` : `-${v.value}%`})
              </Option>
            ))
          )}
        </Select>
      </Form.Item>

      {discountText && (
        <Form.Item>
          <Text type="success">{discountText}</Text>
        </Form.Item>
      )}
    </>
  );
};

export default VoucherSelector;
