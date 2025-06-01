import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
  Divider,
  message,
  Select,
  Tag,
  DatePicker,
  TimePicker,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import orderApi from '../../api/orderApi';
import tableApi from '../../api/tableApi';
import customerApi from '../../api/customerApi';
import { OrderResponse, CreateOrderPayload } from '../../types/Orderlist';
import { CustomerModel } from '../../types/Customer';
import { Table as TableModel } from '../../types/table';
import TableSelectModal from './grpc/TableSelector';
import OrderItemFields from './grpc/OrderItemFields';

import dayjs from 'dayjs';

const { Option } = Select;

type Props = {
  initialData?: Partial<OrderResponse>;
  onSave: (order: any) => void;
  onCancel: () => void;
};

const OrderForm = ({ initialData, onSave, onCancel }: Props) => {
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [fetchingCustomers, setFetchingCustomers] = useState(false);
  const [tables, setTables] = useState<TableModel[]>([]);
  const [selectedTables, setSelectedTables] = useState<TableModel[]>([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const fetchCustomers = async (search = '') => {
    setFetchingCustomers(true);
    try {
      const res = await customerApi.getAll();
      setCustomers(res.data || []);
    } catch (err) {
      console.error('Lỗi khi tìm khách hàng:', err);
      message.error('Không thể tải danh sách khách hàng');
    } finally {
      setFetchingCustomers(false);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await tableApi.getAll();
      setTables(res || []);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách bàn:', err);
    }
  };

  const debouncedFetchCustomers = useCallback(debounce(fetchCustomers, 500), []);
  const guestCount = Number(Form.useWatch('guest_count', form));
  const orderType = Form.useWatch('order_type', form);

  useEffect(() => {
    if (initialData?.customer?.id) {
      form.setFieldsValue({
        customerId: String(initialData.customer.id),
      });
      fetchCustomers();
    }

    if (initialData) {
      form.setFieldsValue({
        order_type: initialData.table ? 'dine-in' : 'take-away',
        notes: initialData.note,
        guest_count: initialData.guest_count,
        items:
          initialData.order_items?.map((item) => ({
            product_id: item.product_id,
            name: item.product?.name || '',
            quantity: item.quantity,
            price: Number(item.price),
          })) || [],
      });

      if (initialData.table) {
        const table = {
          ...initialData.table,
          table_id: initialData.table.id,
          table_number: (initialData.table as any).table_number,
          status: (initialData.table as any).status,
          seat_count: (initialData.table as any).seat_count,
        } as TableModel;
        setSelectedTables([table]);
      }
    }
  }, [initialData, form]);

  const handleFinish = async (values: any) => {
    let order_date: string | undefined = undefined;

    if (orderType === 'reservation') {
      const { reservation_date, reservation_time } = values;
      order_date = dayjs(reservation_date)
        .hour(dayjs(reservation_time).hour())
        .minute(dayjs(reservation_time).minute())
        .second(0)
        .toISOString();
    }

    const order_items = (values.items || []).map((item: any) => ({
      product_id: item.product_id || 0,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalSeats = selectedTables.reduce((sum, t) => sum + t.seat_count, 0);
    if (orderType === 'dine-in' && guestCount && totalSeats < guestCount) {
      message.error(`Tổng số ghế (${totalSeats}) không đủ cho ${guestCount} khách.`);
      return;
    }

    const payload: CreateOrderPayload = {
      customer_id: parseInt(values.customerId),
      table_id: (orderType === 'dine-in' || orderType === 'reservation') && selectedTables.length > 0
        ? selectedTables[0].table_id
        : undefined,
      order_type: values.order_type,
      note: values.notes,
      guest_count: (orderType === 'dine-in' || orderType === 'reservation') ? guestCount : undefined,
      order_items,
      order_date: order_date ?? '',
    };

    try {
      const createdOrder = await orderApi.create(payload);
      message.success('Đơn hàng đã được tạo');
      onSave(createdOrder);
      form.resetFields();
    } catch (err) {
      console.error('Tạo đơn hàng thất bại:', err);
      message.error('Tạo đơn hàng thất bại');
    }
  };

  const handleSelectTable = (tables: TableModel[]) => {
    setSelectedTables(tables);
    setIsTableModalOpen(false);
  };

  const handleOpenTableModal = async () => {
    await fetchTables();
    setIsTableModalOpen(true);
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Typography.Title level={4}>{initialData ? 'Edit Order' : 'New Order'}</Typography.Title>

      <Form.Item
        label="Customer"
        name="customerId"
        rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
      >
        <Select
          showSearch
          placeholder="Tìm khách hàng"
          filterOption={false}
          onSearch={debouncedFetchCustomers}
          onFocus={() => fetchCustomers()}
          loading={fetchingCustomers}
          notFoundContent={fetchingCustomers ? 'Đang tải...' : 'Không có kết quả'}
        >
          {customers.map((c) => (
            <Option key={c.customer_id} value={String(c.customer_id)}>
              {c.user_info?.name} ({c.user_info?.account?.email})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Order Type"
        name="order_type"
        rules={[{ required: true, message: 'Vui lòng chọn loại đơn hàng' }]}
      >
        <Select placeholder="Chọn loại đơn hàng">
          <Option value="dine-in">Dùng tại chỗ</Option>
          <Option value="reservation">Đặt bàn trước</Option>
          <Option value="take-away">Mang đi</Option>
          <Option value="delivery">Giao hàng</Option>
        </Select>
      </Form.Item>

      {(orderType === 'dine-in' || orderType === 'reservation') && (
        <Form.Item
          label="Guest Count"
          name="guest_count"
          rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
        >
          <InputNumber min={1} placeholder="Số lượng khách" />
        </Form.Item>
      )}

      {(orderType === 'dine-in' || orderType === 'reservation') && (
        <Form.Item label="Table">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button type="dashed" onClick={handleOpenTableModal}>
              Chọn bàn
            </Button>
            {selectedTables.map((t) => (
              <Tag key={t.table_id} color="green" style={{ marginBottom: 8 }}>
                Bàn {t.table_number} - Tầng {t.floor} ({t.seat_count} ghế)
              </Tag>
            ))}
          </div>
        </Form.Item>
      )}

      {orderType === 'reservation' && (
        <>
          <Form.Item
            label="Ngày đặt"
            name="reservation_date"
            rules={[{ required: true, message: 'Chọn ngày đặt bàn' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Giờ đặt"
            name="reservation_time"
            rules={[{ required: true, message: 'Chọn giờ đặt bàn' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </>
      )}

      <Form.Item label="Notes" name="notes">
        <Input.TextArea rows={2} />
      </Form.Item>

      <Divider />
      <Typography.Title level={5}>Items</Typography.Title>
            <OrderItemFields form={form} />




      <Divider />
      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save Order
          </Button>
        </Space>
      </Form.Item>

      <TableSelectModal
        open={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onSelect={handleSelectTable}
        tables={tables}
        selected={selectedTables}
        guestCount={guestCount}
        onCancel={() => setIsTableModalOpen(false)}
      />
    </Form>
  );
};

export default OrderForm;
