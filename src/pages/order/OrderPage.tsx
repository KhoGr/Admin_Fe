
import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  Space,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { toast } from 'sonner';
import { io } from 'socket.io-client';

import OrderForm from '../../components/order/OrderForm';
import OrderTable from '../../components/order/OrderTable';
import { OrderModel } from '../../types/order';
import orderApi from '../../api/orderApi';

const socket = io('http://localhost:4000'); // kết nối socket tại đây luôn

const Orders = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderModel | null>(null);
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [searchText, setSearchText] = useState('');

  const fetchOrders = async () => {
    try {
      const orderModels = await orderApi.getAll();
      if (Array.isArray(orderModels)) {
        setOrders(orderModels);
      } else {
        console.error('Unexpected response format:', orderModels);
        setOrders([]);
      }
    } catch (err) {
      toast.error('Failed to load orders');
      console.error('API Error:', err);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on('order-created', (newOrder) => {
      toast.info(`Đơn hàng mới từ khách ${newOrder.customer_name}`);
      fetchOrders();
    });

    socket.on('order-updated', () => {
      fetchOrders();
    });

    return () => {
      socket.off('order-created');
      socket.off('order-updated');
    };
  }, []);

  const handleDelete = async (orderId: string | number) => {
    try {
      await orderApi.delete(Number(orderId));
      setOrders((prev) => prev.filter((o) => Number(o.id) !== Number(orderId)));
      toast.success(`Order #${String(orderId).slice(-5)} has been deleted.`);
    } catch {
      toast.error('Failed to delete order.');
    }
  };

  const handleEdit = (order: OrderModel) => {
    setEditingOrder(order);
    setIsOpen(true);
  };

  const handleSave = async (order: OrderModel) => {
    try {
      const refreshedOrders = await orderApi.getAll();
      setOrders(refreshedOrders);

      socket.emit('order-updated'); // gửi tín hiệu cho client khác
      toast.success(
        `Order #${String(order.id).slice(-5)} has been ${editingOrder ? 'updated' : 'created'}.`
      );
    } catch (error) {
      toast.error('Failed to reload orders after saving.');
      console.error('Error fetching orders:', error);
    } finally {
      setIsOpen(false);
      setEditingOrder(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={3}>Orders</Typography.Title>
          <Typography.Text type="secondary">Manage customer orders.</Typography.Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsOpen(true);
              setEditingOrder(null);
            }}
          >
            New Order
          </Button>
        </Space>
      </div>

      <Input
        placeholder="Search by customer name..."
        prefix={<SearchOutlined />}
        allowClear
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300 }}
      />

      <OrderTable
        orders={orders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchText={searchText}
      />

      <Modal
        title={editingOrder ? `Order #${String(editingOrder.id).slice(-5)}` : 'New Order'}
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          setEditingOrder(null);
        }}
        footer={null}
        width={700}
      >
        <OrderForm
          initialData={editingOrder ?? undefined}
          onSave={handleSave}
          onCancel={() => {
            setIsOpen(false);
            setEditingOrder(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Orders;
