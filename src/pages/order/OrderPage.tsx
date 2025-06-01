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
    orderApi
      .getAll()
      .then((orderModels) => {
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

  const handleDelete = async (orderId: string | number) => {
    try {
      await orderApi.delete(Number(orderId));
      setOrders((prev) => prev.filter((o) => Number(o.id) !== Number(orderId)));
      toast.success(`Order #${String(orderId).slice(-5)} has been deleted.`);
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
      `Order for ${order.customerName} has been ${
        editingOrder ? 'updated' : 'created'
      }.`
    );
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string | number) => <strong>#{String(id).slice(-5)}</strong>,
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
      render: (text: string | number) => (text ? `Table ${text}` : 'Takeaway'),
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
          <Button
            size="small"
            type="link"
            onClick={() => handleEdit(order, true)}
          >
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Typography.Title level={3}>Orders</Typography.Title>
          <Typography.Text type="secondary">
            Manage customer orders.
          </Typography.Text>
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
        title={
          editingOrder
            ? `Order #${String(editingOrder.id).slice(-5)}`
            : 'New Order'
        }
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
          <OrderDetails order={{
            ...editingOrder,
            updated_at: (editingOrder as any).updated_at ?? (editingOrder as any).updatedAt ?? editingOrder.createdAt ?? '',
            customer_id: (editingOrder as any).customer_id ?? '',
            table_id: (editingOrder as any).table_id ?? '',
            guest_count: (editingOrder as any).guest_count ?? 1,
            order_type: (editingOrder as any).order_type ?? 'dine-in',
            payment_method: (editingOrder as any).payment_method ?? 'cash',
            note: (editingOrder as any).note ?? editingOrder.notes ?? '',
            created_at: (editingOrder as any).created_at ?? editingOrder.createdAt ?? '',
            status: (() => {
              switch (editingOrder.status) {
                case 'ready':
                  return 'served';
                case 'delivered':
                  return 'completed';
                case 'canceled':
                  return 'cancelled';
                default:
                  return editingOrder.status;
              }
            })(),
            id: Number(editingOrder.id),
            customer: {
              id: (editingOrder as any).customer_id ?? 0,
              user_info: {
                name: editingOrder.customerName,
                avatar: null,
              },
            },
            // Add missing OrderResponse fields with fallback values
            order_date: (editingOrder as any).order_date ?? (editingOrder as any).created_at ?? editingOrder.createdAt ?? '',
            total_amount: (editingOrder as any).total_amount ?? editingOrder.total ?? 0,
            discount_amount: (editingOrder as any).discount_amount ?? 0,
            final_amount: (editingOrder as any).final_amount ?? editingOrder.total ?? 0,
            is_paid: (editingOrder as any).is_paid ?? false,
          }} />
        ) : (
          <OrderForm
            initialData={
              editingOrder
                ? {
                    ...editingOrder,
                    id: Number(editingOrder.id),
                    status: (() => {
                      switch (editingOrder.status) {
                        case 'ready':
                          return 'served';
                        case 'delivered':
                          return 'completed';
                        case 'canceled':
                          return 'cancelled';
                        default:
                          return editingOrder.status;
                      }
                    })(),
                  }
                : undefined
            }
            onSave={(order) => handleSave(order)}
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
