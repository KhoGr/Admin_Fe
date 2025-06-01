import React, { useState, useRef, useEffect } from 'react';
import { Form, InputNumber, Button, Space, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import {Table as TableModel} from "../../../types/table"
import menuItemApi from '../../../api/menuItemApi';
import { FormInstance } from 'antd';

type Props = {
  form: FormInstance<any>;
};


const OrderItemFields = ({ form }: Props) => {
  const [menuOptions, setMenuOptions] = useState<{ label: string; value: number }[]>([]);

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

  return (
    <Form.List name="items">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" wrap>
              <Form.Item
                {...restField}
                name={[name, 'product_id']}
                rules={[{ required: true, message: 'Chọn sản phẩm' }]}
              >
                <Select
                  showSearch
                  placeholder="Tìm món ăn"
                  filterOption={false}
                  onSearch={debouncedSearch}
                  options={menuOptions}
                  style={{ width: 200 }}
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
                <InputNumber min={0} step={0.1} placeholder="Price" />
              </Form.Item>

              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Thêm món
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default OrderItemFields;
