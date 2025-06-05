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
  Checkbox,
} from 'antd';
import orderApi from '../../api/orderApi';
import tableApi from '../../api/tableApi';
import { OrderModel, OrderCreateRequest } from '../../types/order';
import { Table } from '../../types/table';
import TableSelectModal from './grpc/TableSelector';
import OrderItemFields from './grpc/OrderItemFields';
import VoucherSelector from './grpc/VoucherSelector';
import CustomerSelect from './grpc/CustomerSelect'; // ⬅️ Đã tách riêng
import io from 'socket.io-client';


const { Option } = Select;
const socket = io('http://localhost:4000');

type Props = {
  initialData?: Partial<OrderModel>;
  onSave: (order: any) => void;
  onCancel: () => void;
};

const OrderForm = ({ initialData, onSave, onCancel }: Props) => {
  const [form] = Form.useForm();
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTables, setSelectedTables] = useState<Table[]>([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [voucherData, setVoucherData] = useState<{
    voucher_id: number;
    discount_amount: number;
    type: 'percent' | 'flat';
  } | null>(null);

  const fetchTables = async () => {
    try {
      const res = await tableApi.getAll();
      setTables(res || []);
    } catch {
      message.error('Lỗi khi lấy danh sách bàn');
    }
  };

  const guestCount = Number(Form.useWatch('guest_count', form));
  const orderType = Form.useWatch('order_type', form);

useEffect(() => {
  if (initialData) {
const mappedItems =
  initialData.order_items?.map((item) => ({
    item_id: {
      value: item.item_id,
      label: item.menu_item?.name || '',
    },
    quantity: item.quantity,
    price: Number(item.menu_item?.price),
  })) || [];

    const totalAmount = mappedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    console.log('🧾 Initial Order Items:', mappedItems);
    console.log('💰 Initial Total Amount:', totalAmount);

    form.setFieldsValue({
      customer_id: String(initialData.customer_id),
      order_type: initialData.order_type,
      note: initialData.note,
      guest_count: initialData.guest_count,
      items: mappedItems,
      status: initialData.status || 'pending',
      payment_method: initialData.payment_method || 'cash',
      is_paid: initialData.is_paid ?? false,
    });

    if (initialData.table) {
      setSelectedTables([
        {
          table_id: initialData.table.table_id,
          table_number: initialData.table.table_number,
          status: initialData.table.status,
          seat_count: initialData.table.seat_count,
          floor: initialData.table.floor,
        },
      ]);
    }

    if (initialData.voucher_id && initialData.discount_amount) {
      const voucher: { voucher_id: number; discount_amount: number; type: 'flat' | 'percent' } = {
        voucher_id: initialData.voucher_id,
        discount_amount: Number(initialData.discount_amount),
        type: 'flat',
      };
      setVoucherData(voucher);
      console.log('🏷️ Initial Voucher:', voucher);
    }
  }
}, [initialData]);

const handleFinish = async (values: any) => {
  const totalSeats = selectedTables.reduce((sum, t) => sum + (t.seat_count || 0), 0);
  if (values.order_type === 'dine-in' && values.guest_count && totalSeats < values.guest_count) {
    message.error(`Tổng số ghế (${totalSeats}) không đủ cho ${values.guest_count} khách.`);
    return;
  }

  const orderItems = (values.items || []).map((item: any) => ({
    item_id: typeof item.item_id === 'object' ? item.item_id.value : item.item_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const totalAmount = orderItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  let finalAmount = totalAmount;
  if (voucherData) {
    if (voucherData.type === 'percent') {
      finalAmount = totalAmount * (1 - voucherData.discount_amount / 100);
    } else {
      finalAmount = totalAmount - voucherData.discount_amount;
    }
    if (finalAmount < 0) finalAmount = 0;
  }

  const payload: OrderCreateRequest = {
    customer_id: parseInt(values.customer_id),
    table_id:
      values.order_type === 'dine-in' && selectedTables.length > 0
        ? selectedTables[0].table_id
        : undefined,
    order_type: values.order_type,
    guest_count: values.order_type === 'dine-in' ? values.guest_count : undefined,
    note: values.note,
    order_items: orderItems.map((i: any) => ({
      item_id: i.item_id,
      quantity: i.quantity,
    })),
    final_amount: finalAmount,
    status: values.status,
    payment_method: values.payment_method,
    is_paid: values.is_paid,
    ...(voucherData
      ? {
          voucher_id: voucherData.voucher_id,
          discount_amount: voucherData.discount_amount,
        }
      : {}),
  };

  console.log('📦 Payload gửi đi:', JSON.stringify(payload, null, 2));

  try {
    let result;
    if (initialData?.id) {
      result = await orderApi.update(initialData.id, payload);
      message.success('Đơn hàng đã được cập nhật');
      socket.emit('order-updated', result); // 👈 Emit cập nhật
    } else {
      result = await orderApi.create(payload);
      message.success('Đơn hàng đã được tạo');
      socket.emit('order-created', result); // 👈 Emit tạo mới
    }

    onSave(result);
    await tableApi.getAll();
    form.resetFields();
  } catch (err) {
    console.error(err);
    message.error('Xử lý đơn hàng thất bại');
  }
};


  const handleSelectTable = (tables: Table[]) => {
    setSelectedTables(tables);
    setIsTableModalOpen(false);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{
        order_type: 'dine-in',
        status: 'pending',
        payment_method: 'cash',
        is_paid: false,
      }}
    >
      <Typography.Title level={4}>
        {initialData ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng'}
      </Typography.Title>

      <Form.Item
        label="Khách hàng"
        name="customer_id"
        rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
      >
        <CustomerSelect />
      </Form.Item>

      <Form.Item
        label="Loại đơn hàng"
        name="order_type"
        rules={[{ required: true, message: 'Vui lòng chọn loại đơn hàng' }]}
      >
        <Select placeholder="Chọn loại đơn hàng">
          <Option value="dine-in">Dùng tại chỗ</Option>
          <Option value="take-away">Mang đi</Option>
          <Option value="delivery">Giao hàng</Option>
        </Select>
      </Form.Item>

      {orderType === 'dine-in' && (
        <>
          <Form.Item
            label="Số khách"
            name="guest_count"
            rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item label="Bàn đã chọn">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Button
                type="dashed"
                onClick={() => {
                  fetchTables();
                  setIsTableModalOpen(true);
                }}
              >
                Chọn bàn
              </Button>
              {selectedTables.map((t) => (
                <Tag key={t.table_id} color="green">
                  {t.floor} - {t.table_number} ({t.seat_count} ghế)
                </Tag>
              ))}
            </div>
          </Form.Item>
        </>
      )}

      <Form.Item label="Ghi chú" name="note">
        <Input.TextArea rows={2} />
      </Form.Item>

      <Divider />
      <Typography.Title level={5}>Danh sách món</Typography.Title>
      <OrderItemFields form={form} />

      <Divider />
      <Typography.Title level={5}>Voucher</Typography.Title>
      <VoucherSelector
        form={form}
        onChange={(value) => {
          if (value) {
            setVoucherData({
              ...value,
              type: 'flat',
            });
          } else {
            setVoucherData(null);
          }
        }}
      />

      <Divider />
      <Typography.Title level={5}>Thông tin thanh toán</Typography.Title>

      <Form.Item
        label="Trạng thái đơn hàng"
        name="status"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select placeholder="Chọn trạng thái">
          <Option value="pending">Chờ xác nhận</Option>
          <Option value="preparing">Đang chuẩn bị</Option>
          <Option value="served">Đã phục vụ</Option>
          <Option value="completed">Hoàn tất</Option>
          <Option value="cancelled">Đã hủy</Option>
          <Option value="refunded">Hoàn tiền</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Phương thức thanh toán"
        name="payment_method"
        rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
      >
        <Select placeholder="Chọn phương thức">
          <Option value="cash">Tiền mặt</Option>
          <Option value="atm">Thẻ ATM</Option>
        </Select>
      </Form.Item>

      <Form.Item name="is_paid" valuePropName="checked">
        <Checkbox>Đã thanh toán</Checkbox>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Lưu đơn hàng
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
