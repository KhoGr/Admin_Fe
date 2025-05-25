import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Card,
  Col,
  Row,
  Statistic,
  Badge,
  Progress,
  Button,
  Modal,
  Form,
  Input,
  Table,
  Space,
} from 'antd';
import {
  InboxOutlined,
  AlertOutlined,
  PlusOutlined,
  DownloadOutlined,
  BarChartOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  totalValue: number;
  lastRestocked: Date;
  minimumStock: number;
  supplier: string;
}

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('inventoryItems');
    if (stored) {
      setInventoryItems(JSON.parse(stored, (key, value) =>
        key === 'lastRestocked' ? new Date(value) : value
      ));
    } else {
      // If no localStorage, load default data
      const defaultItems: InventoryItem[] = [
        {
          id: '1',
          name: 'Pasta',
          category: 'Dry Goods',
          stock: 120,
          unitPrice: 2.5,
          totalValue: 300,
          lastRestocked: new Date(2023, 5, 15),
          minimumStock: 50,
          supplier: 'Italian Foods Inc',
        },
        {
          id: '2',
          name: 'Rice',
          category: 'Dry Goods',
          stock: 85,
          unitPrice: 1.8,
          totalValue: 153,
          lastRestocked: new Date(2023, 6, 2),
          minimumStock: 40,
          supplier: 'Global Rice Suppliers',
        },
        {
          id: '3',
          name: 'Chicken Breast',
          category: 'Meat',
          stock: 45,
          unitPrice: 5.2,
          totalValue: 234,
          lastRestocked: new Date(2023, 6, 10),
          minimumStock: 30,
          supplier: 'Fresh Farms',
        },
      ];
      setInventoryItems(defaultItems);
      localStorage.setItem('inventoryItems', JSON.stringify(defaultItems));
    }
  }, []);

  const handleAddItem = (values: any) => {
    const newItem: InventoryItem = {
      id: uuidv4(),
      name: values.name,
      category: values.category,
      stock: Number(values.stock),
      unitPrice: Number(values.unitPrice),
      totalValue: Number(values.stock) * Number(values.unitPrice),
      lastRestocked: new Date(),
      minimumStock: Number(values.minimumStock),
      supplier: values.supplier,
    };

    const updatedItems = [...inventoryItems, newItem];
    setInventoryItems(updatedItems);
    localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
    setModalOpen(false);
    form.resetFields();
  };

  const totalItems = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventoryItems.filter((item) => item.stock <= item.minimumStock).length;
  const criticalItems = inventoryItems.filter(
    (item) => item.stock <= item.minimumStock * 0.5,
  ).length;

  // Group by category
  const categoryCounts: Record<string, number> = {};
  inventoryItems.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Badge color="blue" text={category} />,
    },
    {
      title: 'Stock Level',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number, record: InventoryItem) => {
        const percentage = (stock / record.minimumStock) * 100;
        const percent = percentage > 200 ? 100 : percentage / 2;
        const status =
          stock <= record.minimumStock * 0.5
            ? 'exception'
            : stock <= record.minimumStock
              ? 'active'
              : 'normal';
        return (
          <>
            <div>{stock}</div>
            <Progress percent={Math.round(percent)} status={status} showInfo={false} />
          </>
        );
      },
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (value: number) => <strong>${value.toFixed(2)}</strong>,
    },
    {
      title: 'Last Restocked',
      dataIndex: 'lastRestocked',
      key: 'lastRestocked',
      render: (date: Date) => format(new Date(date), 'MMM d, yyyy'),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: InventoryItem) => {
        const stock = record.stock;
        const min = record.minimumStock;
        if (stock <= min * 0.5) {
          return <Badge status="error" text="Critical" />;
        } else if (stock <= min) {
          return <Badge status="warning" text="Low Stock" />;
        }
        return <Badge status="success" text="In Stock" />;
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Inventory Management</h1>
      <p style={{ color: '#888' }}>Track and manage your restaurant's inventory</p>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Items" value={totalItems} prefix={<InboxOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Inventory Value"
              value={totalValue}
              prefix={<BarChartOutlined />}
              precision={0}
              suffix="$"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={lowStockItems}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Critical Items"
              value={criticalItems}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Inventory by Category" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <Col span={6} key={category}>
              <Statistic title={category} value={count} />
            </Col>
          ))}
        </Row>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <h2>Inventory Items</h2>
            <p style={{ color: '#888' }}>Manage your restaurant's inventory</p>
          </Col>
          <Col>
            <Space>
              <Button icon={<PlusOutlined />} type="primary" onClick={() => setModalOpen(true)}>
                Add Item
              </Button>
              <Button icon={<DownloadOutlined />}>Export</Button>
            </Space>
          </Col>
        </Row>
        <Table dataSource={inventoryItems} columns={columns} rowKey="id" />
      </Card>

      <Modal
        title="Add New Inventory Item"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddItem}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true }]}>
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="minimumStock" label="Min. Stock" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="supplier" label="Supplier" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;
