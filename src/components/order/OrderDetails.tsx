import { Typography, Divider } from "antd";
import { Order } from "../../types/order";

type Props = {
  order: Order;
};

const OrderDetails = ({ order }: Props) => {
  return (
    <div>
      <Typography.Title level={4}>Customer: {order.customerName}</Typography.Title>
      <Typography.Text strong>Table: </Typography.Text>{order.tableNumber || "Takeaway"}<br />
      <Typography.Text strong>Created At: </Typography.Text>{new Date(order.createdAt).toLocaleString()}<br />
      <Typography.Text strong>Status: </Typography.Text>{order.status}<br />
      {order.notes && (
        <>
          <Typography.Text strong>Notes: </Typography.Text>{order.notes}<br />
        </>
      )}

      <Divider />
      <Typography.Title level={5}>Items</Typography.Title>
      <ul>
        {order.items.map(item => (
          <li key={item.id}>
            {item.quantity} x {item.name} - ${item.price.toFixed(2)} = ${item.subtotal.toFixed(2)}
          </li>
        ))}
      </ul>
      <Divider />
      <Typography.Text strong>Total: </Typography.Text>${order.total.toFixed(2)}
    </div>
  );
};

export default OrderDetails;
