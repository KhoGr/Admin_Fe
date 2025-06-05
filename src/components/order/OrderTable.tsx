// components/order/OrderTable.tsx
import { Table, Button, Badge, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { OrderModel } from '../../types/order';

interface OrderTableProps {
  orders: OrderModel[];
  onEdit: (order: OrderModel) => void;
  onDelete: (id: number | string) => void;
  searchText: string;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onEdit, onDelete, searchText }) => {
  const filteredOrders = orders.filter((order) =>
    order.customer?.user_info?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<OrderModel> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <strong>#{String(id).slice(-5)}</strong>,
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
      title: 'Final',
      key: 'final_amount',
      render: (_, order) => `$${Number(order.final_amount || 0).toFixed(2)}`,
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
        const statusColors: Record<OrderModel['status'], any> = {
          pending: 'warning',
          preparing: 'processing',
          served: 'default',
          completed: 'success',
          cancelled: 'error',
          refunded: 'default',
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
          <Button size="small" type="link" onClick={() => onEdit(order)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this order?"
            onConfirm={() => onDelete(order.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={filteredOrders}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default OrderTable;
