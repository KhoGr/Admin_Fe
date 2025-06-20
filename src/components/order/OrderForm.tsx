import { useEffect, useState } from 'react';
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
  DatePicker,
} from 'antd';
import io from 'socket.io-client';
import dayjs from 'dayjs';
import orderApi from '../../api/orderApi';
import tableApi from '../../api/tableApi';
import { OrderModel, OrderCreateRequest } from '../../types/order';
import { Table } from '../../types/table';
import TableSelectModal from './grpc/TableSelector';
import OrderItemFields from './grpc/OrderItemFields';
import VoucherSelector from './grpc/VoucherSelector';
import CustomerSelect from './grpc/CustomerSelect';

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

  const guestCount = Number(Form.useWatch('guest_count', form));
  const orderType = Form.useWatch('order_type', form);

  const fetchTables = async () => {
    try {
      const res = await tableApi.getAll();
      setTables(res || []);
    } catch {
      message.error('Lỗi khi lấy danh sách bàn');
    }
  };

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

      const totalAmount = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      form.setFieldsValue({
        customer_id: String(initialData.customer_id),
        order_type: initialData.order_type,
        note: initialData.note,
        guest_count: initialData.guest_count,
        reservation_time: initialData.reservation_time
          ? dayjs(initialData.reservation_time)
          : undefined,
        items: mappedItems,
        status: initialData.status || 'pending',
        payment_method: initialData.payment_method || 'cash',
        is_paid: initialData.is_paid ?? false,
        delivery_address: initialData.delivery_address,
        phone: initialData.phone,
      });

      if (Array.isArray(initialData.tables)) {
        setSelectedTables(
          initialData.tables.map((table) => ({
            table_id: table.table_id,
            table_number: table.table_number,
            status: table.status,
            seat_count: table.seat_count,
            floor: table.floor,
          })),
        );
      }

      if (initialData.voucher_id && initialData.discount_amount) {
        const voucher = {
          voucher_id: initialData.voucher_id,
          discount_amount: Number(initialData.discount_amount),
          type: 'flat' as 'flat',
        };
        setVoucherData(voucher);
      }
    }
  }, [initialData]);

  const handleFinish = async (values: any) => {
    const totalSeats = selectedTables.reduce((sum, t) => sum + (t.seat_count || 0), 0);

    if (
      ['dine-in', 'reservation'].includes(values.order_type) &&
      values.guest_count &&
      totalSeats < values.guest_count
    ) {
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
      0,
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
      table_ids:
        ['dine-in', 'reservation'].includes(values.order_type) && selectedTables.length > 0
          ? selectedTables.map((t) => t.table_id)
          : [],
      order_type: values.order_type,
      guest_count: ['dine-in', 'reservation'].includes(values.order_type)
        ? values.guest_count
        : undefined,
      reservation_time:
        values.order_type === 'reservation' && values.reservation_time
          ? values.reservation_time.toISOString()
          : undefined,
      note: values.note,
      delivery_address: values.delivery_address,
      phone: values.phone,
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

    try {
      let result;
      if (initialData?.id) {
        result = await orderApi.update(initialData.id, payload);
        message.success('Đơn hàng đã được cập nhật');
        socket.emit('order-updated', result);
      } else {
        result = await orderApi.create(payload);
        message.success('Đơn hàng đã được tạo');
        socket.emit('order-created', result);
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
          <Option value="reservation">Đặt bàn trước</Option>
        </Select>
      </Form.Item>

      {(orderType === 'reservation' || orderType === 'dine-in') && (
        <>
          <Form.Item
            label="Số khách"
            name="guest_count"
            rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            label="Thời gian đặt bàn"
            name="reservation_time"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian đặt bàn' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
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
                <Tag key={t.table_id} color="blue">
                  {t.floor} - {t.table_number} ({t.seat_count} ghế)
                </Tag>
              ))}
            </div>
          </Form.Item>
        </>
      )}

      {orderType === 'delivery' && (
        <>
          <Form.Item
            label="Địa chỉ giao hàng"
            name="delivery_address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Số điện thoại người nhận"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại người nhận' },
              { pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ' },
            ]}
          >
            <Input />
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
        onChange={(value: { voucher_id: number; discount_amount: number; type: 'flat' | 'percent' } | null) => {
          if (value) {
            if (value.type === 'flat' || value.type === 'percent') {
              setVoucherData({
                voucher_id: value.voucher_id,
                discount_amount: value.discount_amount,
                type: value.type,
              });
            } else {
              console.warn('Voucher type không hợp lệ:', value.type);
              setVoucherData(null);
            }
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
        <Select>
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
        <Select>
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
        tables={tables}
        onSelect={handleSelectTable}
        selected={selectedTables}
        guestCount={guestCount}
        onCancel={() => setIsTableModalOpen(false)}
      />
    </Form>
  );
};

export default OrderForm;
