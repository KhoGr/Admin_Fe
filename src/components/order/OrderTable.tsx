// import { useEffect, useState } from 'react';
// import { useForm, useFieldArray } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import {
//   Button,
//   Form,
//   Input,
//   Select,
//   InputNumber,
//   Typography,
//   Divider,
//   Space,
//   Modal,
//   message,
// } from 'antd';
// import { MinusCircleOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
// import { Order, CreateOrderPayload } from '../../types/Orderlist';
// import { mockMenuItems } from '../../mock/mocks';
// import orderApi from '../../api/orderApi';

// const { TextArea } = Input;
// const { Option } = Select;

// // Sample customer & table options (you might fetch these from API)
// const customers = [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' },
// ];
// const tables = [
//   { id: 1, name: 'Table 1' },
//   { id: 2, name: 'Table 2' },
// ];

// const formSchema = z.object({
//   customer_id: z.number().optional(),
//   table_id: z.number().optional(),
//   guest_count: z.number().optional(),
//   order_type: z.enum(['dine-in', 'take-away', 'delivery']),
//   note: z.string().optional(),
//   order_items: z
//     .array(
//       z.object({
//         product_id: z.number(),
//         quantity: z.coerce.number().min(1),
//       })
//     )
//     .min(1, 'Order must have at least one item'),
// });

// type FormData = z.infer<typeof formSchema>;

// type OrderFormProps = {
//   initialData: Order | null;
//   onSave: (data: Order) => void;
//   onCancel: () => void;
// };

// export function OrderForm({ initialData, onSave, onCancel }: OrderFormProps) {
//   const [total, setTotal] = useState(0);

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     watch,
//     register,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: initialData
//       ? {
//           customer_id: initialData.customer_id ?? undefined,
//           table_id: initialData.table_id ?? undefined,
//           guest_count: initialData.guest_count ?? undefined,
//           order_type: initialData.order_type,
//           note: initialData.note ?? '',
//           order_items:
//             initialData.order_items?.map((item) => ({
//               product_id: item.product_id,
//               quantity: item.quantity,
//             })) ?? [],
//         }
//       : {
//           customer_id: undefined,
//           table_id: undefined,
//           guest_count: undefined,
//           order_type: 'dine-in',
//           note: '',
//           order_items: [{ product_id: Number(mockMenuItems[0]?.id ?? 1), quantity: 1 }],
//         },
//   });

//   const { fields, append, remove } = useFieldArray({ control, name: 'order_items' });
//   const items = watch('order_items');

//   useEffect(() => {
//     let newTotal = 0;
//     items.forEach((item) => {
//       const product = mockMenuItems.find((p) => Number(p.id) === item.product_id);
//       if (product) newTotal += product.price * item.quantity;
//     });
//     setTotal(newTotal);
//   }, [items]);

//   const onSubmit = async (values: FormData) => {
//     try {
//       if (initialData) {
//         await orderApi.updateStatus(initialData.id, { status: initialData.status });
//         message.success('Order updated');
//         const updated = await orderApi.getById(initialData.id);
//         onSave(updated);
//       } else {
//         const created = await orderApi.create({
//           ...values,
//           order_date: new Date().toISOString(),
//         });
//         message.success('Order created');
//         onSave(created);
//       }
//     } catch (error) {
//       console.error(error);
//       message.error('Error saving order');
//     }
//   };

//   return (
//     <Form layout="vertical" onFinish={handleSubmit(onSubmit)} autoComplete="off">
//       <Form.Item label="Customer" validateStatus={errors.customer_id ? 'error' : ''}>
//         <Select
//           value={watch('customer_id')}
//           onChange={(val) => setValue('customer_id', val)}
//           allowClear
//         >
//           {customers.map((c) => (
//             <Option key={c.id} value={c.id}>
//               {c.name}
//             </Option>
//           ))}
//         </Select>
//       </Form.Item>

//       <Form.Item label="Table" validateStatus={errors.table_id ? 'error' : ''}>
//         <Select
//           value={watch('table_id')}
//           onChange={(val) => setValue('table_id', val)}
//           allowClear
//         >
//           {tables.map((t) => (
//             <Option key={t.id} value={t.id}>
//               {t.name}
//             </Option>
//           ))}
//         </Select>
//       </Form.Item>

//       <Form.Item label="Order Type" validateStatus={errors.order_type ? 'error' : ''}>
//         <Select
//           value={watch('order_type')}
//           onChange={(val) => setValue('order_type', val)}
//         >
//           <Option value="dine-in">Dine In</Option>
//           <Option value="take-away">Take Away</Option>
//           <Option value="delivery">Delivery</Option>
//         </Select>
//       </Form.Item>

//       <Divider>Order Items</Divider>

//       {fields.map((field, index) => (
//         <Space key={field.id} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
//           <Form.Item
//             label="Product"
//             validateStatus={errors.order_items?.[index]?.product_id ? 'error' : ''}
//           >
//             <Select
//               value={items[index].product_id}
//               onChange={(val) => setValue(`order_items.${index}.product_id`, val)}
//               style={{ width: 200 }}
//             >
//               {mockMenuItems.map((item) => (
//                 <Option key={item.id} value={item.id}>
//                   {item.name} - ${item.price}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Quantity"
//             validateStatus={errors.order_items?.[index]?.quantity ? 'error' : ''}
//           >
//             <InputNumber
//               min={1}
//               value={items[index].quantity}
//               onChange={(val) => setValue(`order_items.${index}.quantity`, Number(val))}
//             />
//           </Form.Item>

//           <Button
//             icon={<MinusCircleOutlined />}
//             onClick={() => remove(index)}
//             disabled={fields.length === 1}
//             danger
//           />
//         </Space>
//       ))}

//       <Form.Item>
//         <Button
//           type="dashed"
//           onClick={() => append({ product_id: Number(mockMenuItems[0].id), quantity: 1 })}
//           icon={<PlusOutlined />}
//         >
//           Add Item
//         </Button>
//       </Form.Item>

//       <Form.Item label="Note">
//         <TextArea {...register('note')} rows={3} />
//       </Form.Item>

//       <Divider />
//       <div style={{ textAlign: 'right' }}>
//         <Typography.Text strong>Total: ${total.toFixed(2)}</Typography.Text>
//       </div>

//       <Form.Item style={{ textAlign: 'right' }}>
//         <Space>
//           <Button onClick={onCancel}>Cancel</Button>
//           <Button type="primary" htmlType="submit">
//             {initialData ? 'Update' : 'Create'} Order
//           </Button>
//         </Space>
//       </Form.Item>
//     </Form>
//   );
// }
