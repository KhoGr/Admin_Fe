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
import orderApi from '../../api/orderApi';

const Orders = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isViewingOnly, setIsViewingOnly] = useState(false);

  useEffect(() => {
    orderApi.getAll()
      .then((orderModels) => {
        // Map OrderModel[] to Order[] if needed
        const mappedOrders: Order[] = orderModels.map((o: any) => ({
          id: o.id,
          customerName: o.customerName,
          tableNumber: o.tableNumber,
          total: o.total,
          items: o.items,
          createdAt: o.createdAt,
          status: o.status,
        }));
        setOrders(mappedOrders);
      })
      .catch(() => toast.error('Failed to load orders'));
  }, []);

  const handleDelete = async (orderId: string) => {
    try {
      await orderApi.delete(Number(orderId));
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success(`Order #${orderId.slice(-5)} has been deleted.`);
    } catch {
      toast.error('Failed to delete order.');
    }
  };

  const handleEdit = (order: Order, viewOnly = false) => {
    setEditingOrder(order);
    setIsViewingOnly(viewOnly);
    setIsOpen(true);
  };

  const handleSave = (order: Order) => {
    const updatedOrders = editingOrder
      ? orders.map((o) => (o.id === order.id ? order : o))
      : [order, ...orders];

    setOrders(updatedOrders);
    setIsOpen(false);
    setEditingOrder(null);
    setIsViewingOnly(false);
    toast.success(
      `Order for ${order.customerName} has been ${editingOrder ? 'updated' : 'created'}.`
    );
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
      render: (date: string) => new Date(date).toLocaleTimeString(),
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
    order.customerName.toLowerCase().includes(searchText.toLowerCase())
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
            initialData={
              editingOrder
                ? {
                    ...editingOrder,
                    status: editingOrder.status as any, // Cast to OrderStatus if compatible, or map if needed
                  }
                : undefined
            }
            onSave={() => {
              setIsOpen(false);
              setEditingOrder(null);
              setIsViewingOnly(false);
            }}
            onCancel={() => setIsOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Orders;
