import { Typography, Divider } from 'antd';
import { OrderModel } from '../../types/order';

type Props = {
  order: OrderModel;
};

const OrderDetails = ({ order }: Props) => {
  return (
    <div>
      <Typography.Title level={4}>
        Customer: {order.customer?.user_info?.name || 'Unknown'}
      </Typography.Title>

      <Typography.Text strong>Table: </Typography.Text>
      {order.table ? `#${order.table.table_number}` : 'Takeaway / Delivery'}
      <br />

      <Typography.Text strong>Created At: </Typography.Text>
      {new Date(order.created_at).toLocaleString()}
      <br />

      <Typography.Text strong>Status: </Typography.Text>
      {order.status}
      <br />

      {order.note && (
        <>
          <Typography.Text strong>Notes: </Typography.Text>
          {order.note}
          <br />
        </>
      )}

      <Divider />
      <Typography.Title level={5}>Items</Typography.Title>
      <ul>
        {order.order_items?.map((item) => (
          <li key={item.order_item_id}>
            {item.quantity} x {item.menu_item?.name || 'Unknown'} – ${Number(item.price ?? 0).toFixed(2)} = $
            {(item.quantity * Number(item.price ?? 0)).toFixed(2)}
          </li>
        ))}
      </ul>

      <Divider />
      <Typography.Text strong>Total: </Typography.Text>
      $
      {order.order_items
        ? order.order_items
            .reduce((sum, item) => sum + item.quantity * Number(item.price ?? 0), 0)
            .toFixed(2)
        : '0.00'}
    </div>
  );
};

export default OrderDetails;
