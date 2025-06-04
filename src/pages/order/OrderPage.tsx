import { useEffect, useState } from 'react';
import {
  Button,
  Badge,
  Modal,
  Typography,
  Space,
  Table,
  Input,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import OrderForm from '../../components/order/OrderForm';
import OrderDetails from '../../components/order/OrderDetails';
import { OrderModel } from '../../types/order';
import { toast } from 'sonner';
import orderApi from '../../api/orderApi';

const Orders = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderModel | null>(null);
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isViewingOnly, setIsViewingOnly] = useState(false);

  useEffect(() => {
    orderApi
      .getAll()
      .then((orderModels) => {
        if (Array.isArray(orderModels)) {
          setOrders(orderModels);
        } else {
          console.error('Unexpected response format:', orderModels);
          setOrders([]); // fallback an toàn
        }
      })
      .catch(() => toast.error('Failed to load orders'));
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

  const handleEdit = (order: OrderModel, viewOnly = false) => {
    setEditingOrder(order);
    setIsViewingOnly(viewOnly);
    setIsOpen(true);
  };

  const handleSave = (order: OrderModel) => {
    const updatedOrders = editingOrder
      ? orders.map((o) => (o.id === order.id ? order : o))
      : [order, ...orders];

    setOrders(updatedOrders);
    setIsOpen(false);
    setEditingOrder(null);
    setIsViewingOnly(false);
    toast.success(`Order #${String(order.id).slice(-5)} has been ${editingOrder ? 'updated' : 'created'}.`);
  };

  const columns: ColumnsType<OrderModel> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string | number) => <strong>#{String(id).slice(-5)}</strong>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, order) => order.customer?.user_info?.name || 'Guest',
    },
    {
      title: 'VIP',
      key: 'vip_level',
      render: (_, order) => order.customer?.vip_id || 'N/A',
    },
    {
      title: 'Table',
      key: 'table',
      render: (_, order) => order.table ? `Table ${order.table.table_number}` : 'Takeaway',
    },
    {
      title: 'Total',
      key: 'total_amount',
      render: (_, order) => `$${Number(order.total_amount || 0).toFixed(2)}`,
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, order) => `${order.order_items?.length || 0} items`,
    },
    {
      title: 'Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleTimeString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderModel['status']) => {
        const statusColors: Record<OrderModel['status'], "default" | "error" | "warning" | "processing" | "success"> = {
          pending: 'warning',
          preparing: 'processing',
          served: 'default',
          completed: 'success',
          cancelled: 'error',
          refunded: 'default',
        };
        return <Badge status={statusColors[status]} text={status.charAt(0).toUpperCase() + status.slice(1)} />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, order) => (
        <Space>
          <Button size="small" type="link" onClick={() => handleEdit(order, true)}>
            View
          </Button>
          <Popconfirm
            title="Delete this order?"
            onConfirm={() => handleDelete(order.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredOrders = orders.filter((order) =>
    order.customer?.user_info?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

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
              setIsViewingOnly(false);
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

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingOrder ? `Order #${String(editingOrder.id).slice(-5)}` : 'New Order'}
        open={isOpen}
        onCancel={() => {
          setIsOpen(false);
          setEditingOrder(null);
          setIsViewingOnly(false);
        }}
        footer={null}
        width={700}
      >
        {editingOrder && isViewingOnly ? (
          <OrderDetails order={editingOrder} />
        ) : (
          <OrderForm
            initialData={editingOrder ?? undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsOpen(false);
              setEditingOrder(null);
              setIsViewingOnly(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Orders;
