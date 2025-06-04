import React, { useState, useRef, useEffect } from 'react';
import {
  Form,
  InputNumber,
  Button,
  Space,
  Select,
  Input,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import menuItemApi from '../../../api/menuItemApi';
import { FormInstance } from 'antd';

type Props = {
  form: FormInstance<any>;
};

const OrderItemFields = ({ form }: Props) => {
  const [menuOptions, setMenuOptions] = useState<
    { label: string; value: number }[]
  >([]);

  const debouncedSearch = useRef(
    debounce(async (value: string) => {
      if (!value.trim()) return;
      try {
        const res = await menuItemApi.search({ keyword: value });
        const options = res.data.map((item: any) => ({
          label: item.name,
          value: Number(item.item_id),
        }));
        setMenuOptions(options);
      } catch (err) {
        console.error('Search menu item failed:', err);
      }
    }, 300)
  ).current;

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const items = Form.useWatch('items', form);

  const totalAmount = (items || []).reduce((sum: number, item: any) => {
    const qty = Number(item?.quantity || 0);
    const price = Number(item?.price || 0);
    return sum + qty * price;
  }, 0);

  function formatCurrency(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  return (
    <>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="baseline"
                wrap
              >
                <Form.Item
                  {...restField}
                  name={[name, 'item_id']} // ✅ Đúng key rồi
                  rules={[{ required: true, message: 'Chọn món ăn' }]}
                >
                  <Select
                    showSearch
                    placeholder="Tìm món ăn"
                    filterOption={false}
                    onSearch={debouncedSearch}
                    options={menuOptions}
                    style={{ width: 200 }}
                    onSelect={(value) => {
                      menuItemApi.getById(value).then((res) => {
                        const price = parseFloat(
                          String(res.data.price ?? '0')
                        );
                        const currentItems = form.getFieldValue('items') || [];
                        const updatedItems = [...currentItems];
                        updatedItems[name] = {
                          ...updatedItems[name],
                          item_id: value, // ✅ Đảm bảo lưu item_id
                          price,
                        };
                        form.setFieldsValue({ items: updatedItems });
                      });
                    }}
                  />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'quantity']}
                  rules={[{ required: true, message: 'Số lượng' }]}
                >
                  <InputNumber min={1} placeholder="Qty" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'price']}
                  rules={[{ required: true, message: 'Giá' }]}
                >
                  <Input
                    placeholder="Giá (VND)"
                    value={formatCurrency(
                      form.getFieldValue(['items', name, 'price']) || 0
                    )}
                    disabled
                  />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm món
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <strong>Tổng tiền</strong>
        <span style={{ fontWeight: 600, fontSize: 16 }}>
          {formatCurrency(totalAmount)}
        </span>
      </div>
    </>
  );
};

export default OrderItemFields;
