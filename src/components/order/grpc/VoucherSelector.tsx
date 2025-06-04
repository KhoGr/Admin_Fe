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
  onChange: (value: { voucher_id: number; discount_amount: number } | null) => void;
};

const VoucherSelector = ({ form }: Props) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [discountText, setDiscountText] = useState<string>('');

  useEffect(() => {
    voucherApi.getAll().then((res) => {
      setVouchers(
        res.data.map((v: any) => ({
          ...v,
          value: String(v.value),
        })),
      );
    });
  }, []);

  const handleSelect = (voucher_id: number) => {
    const selected = vouchers.find((v) => v.voucher_id === voucher_id);
    if (!selected) return;

    const value = parseFloat(selected.value);
    let discountAmount = 0;
    let display = '';

    if (selected.type === 'flat') {
      discountAmount = value;
      display = `Giảm ${value.toLocaleString('vi-VN')} ₫`;
    } else if (selected.type === 'percent') {
      // Nếu bạn có totalAmount, bạn có thể tính ở đây
      const total = form.getFieldValue('totalAmount') || 0;
      discountAmount = (total * value) / 100;
      display = `Giảm ${value}% ~ ${discountAmount.toLocaleString('vi-VN')} ₫`;
    }

    form.setFieldsValue({
      voucher_id: selected.voucher_id,
      discount_amount: discountAmount,
    });

    setDiscountText(display);
  };

  return (
    <>
      <Form.Item name="voucher_id" label="Mã giảm giá">
        <Select placeholder="Chọn mã giảm giá" onSelect={handleSelect}>
          {vouchers.map((v) => (
            <Option key={v.voucher_id} value={v.voucher_id}>
              {v.code} (
              {v.type === 'flat'
                ? `-${parseInt(v.value).toLocaleString('vi-VN')}₫`
                : `-${v.value}%`}
              )
            </Option>
          ))}
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
