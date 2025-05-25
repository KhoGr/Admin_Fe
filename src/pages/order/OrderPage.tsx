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
import { Order } from '../../types/order';
import { toast } from 'sonner';

const mockOrders: Order[] = [
      {
    id: 'order1',
    customerName: 'John Doe',
    items: [
      {
        id: 'item1',
        menuItemId: 'm1',
        name: 'Grilled Salmon',
        price: 24.99,
        quantity: 2,
        subtotal: 49.98,
      },
      {
        id: 'item2',
        menuItemId: 'm3',
        name: 'Caesar Salad',
        price: 9.99,
        quantity: 1,
        subtotal: 9.99,
      },
    ],
    total: 59.97,
    status: 'delivered',
    createdAt: new Date('2025-05-09T10:30:00'),
    tableNumber: '12',
    notes: 'No onions please',
  },
];

const Orders = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isViewingOnly, setIsViewingOnly] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      setOrders(mockOrders);
    }
  }, []);

  const handleDelete = (orderId: string) => {
    const updatedOrders = orders.filter((o) => o.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    toast.success(`Order #${orderId.slice(-5)} has been deleted.`);
  };

  const handleEdit = (order: Order, viewOnly = false) => {
    setEditingOrder(order);
    setIsViewingOnly(viewOnly);
    setIsOpen(true);
  };

  const handleSave = (order: Order) => {
    const newOrder: Order = {
      ...order,
      id: editingOrder ? order.id : `order_${Date.now()}`,
      createdAt: editingOrder ? order.createdAt : new Date(),
    };

    const updatedOrders = editingOrder
      ? orders.map((o) => (o.id === order.id ? newOrder : o))
      : [newOrder, ...orders];

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setIsOpen(false);
    setEditingOrder(null);
    setIsViewingOnly(false);
    toast.success(
      `Order for ${order.customerName} has been ${
        editingOrder ? 'updated' : 'created'
      }.`,
    );
  };

  const handleStatusChange = (order: Order, newStatus: Order['status']) => {
    const updatedOrder = { ...order, status: newStatus };
    const updatedOrders = orders.map((o) =>
      o.id === order.id ? updatedOrder : o,
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    toast.success(`Order #${order.id.slice(-5)} status changed to ${newStatus}`);
  };

  const handleClearAll = () => {
    localStorage.setItem('deletedOrdersBackup', JSON.stringify(orders)); // backup
    setOrders([]);
    localStorage.setItem('orders', JSON.stringify([]));
    toast.success('All orders have been deleted and backed up to localStorage.');
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <strong>#{id.slice(-5)}</strong>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Table',
      dataIndex: 'tableNumber',
      key: 'tableNumber',
      render: (text: string) => (text ? `Table ${text}` : 'Takeaway'),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => `${items.length} items`,
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleTimeString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => {
        const statusColors: Record<
          Order['status'],
          'default' | 'processing' | 'success' | 'error' | 'warning'
        > = {
          pending: 'warning',
          preparing: 'processing',
          ready: 'default',
          delivered: 'success',
          canceled: 'error',
        };
        return (
          <Badge
            status={statusColors[status]}
            text={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, order) => {
        const nextStatus: { [key in Order['status']]: Order['status'] } = {
          pending: 'preparing',
          preparing: 'ready',
          ready: 'delivered',
          delivered: 'delivered',
          canceled: 'canceled',
        };

        return (
          <Space>
            <Button size="small" type="link" onClick={() => handleEdit(order, true)}>
              View
            </Button>
            {order.status !== 'delivered' && order.status !== 'canceled' && (
              <Button
                size="small"
                onClick={() => handleStatusChange(order, nextStatus[order.status])}
              >
                Next Status
              </Button>
            )}
            {order.status === 'pending' && (
              <Button
                size="small"
                danger
                onClick={() => handleStatusChange(order, 'canceled')}
              >
                Cancel
              </Button>
            )}
            <Popconfirm
              title="Delete this order?"
              onConfirm={() => handleDelete(order.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography.Title level={3}>Orders</Typography.Title>
          <Typography.Text type="secondary">Manage customer orders.</Typography.Text>
        </div>
        <Space>
          <Button icon={<DeleteOutlined />} danger onClick={handleClearAll}>
            Clear All
          </Button>
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
        title={editingOrder ? `Order #${editingOrder.id.slice(-5)}` : 'New Order'}
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
            initialData={editingOrder || undefined}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Orders;
