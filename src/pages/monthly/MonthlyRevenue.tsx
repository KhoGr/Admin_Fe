import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Tabs, Table, Button } from "antd";
import {
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  DollarOutlined
} from "@ant-design/icons";
import {
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar
} from "recharts";

interface MonthlyRevenueType {
  id: string;
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  topSellingItems: { name: string; revenue: number }[];
}

// Mock API
const fetchMonthlyRevenue = async (): Promise<MonthlyRevenueType[]> => {
  // Mock data như bạn đã có
  return [
    {
      id: "1",
      month: "January",
      year: 2023,
      revenue: 42500,
      expenses: 28000,
      profit: 14500,
      topSellingItems: [
        { name: "Spaghetti Carbonara", revenue: 5200 },
        { name: "Grilled Salmon", revenue: 4800 },
        { name: "Chocolate Cake", revenue: 3200 },
      ]
    },
    {
      id: "2",
      month: "February",
      year: 2023,
      revenue: 38900,
      expenses: 26500,
      profit: 12400,
      topSellingItems: [
        { name: "Spaghetti Carbonara", revenue: 4800 },
        { name: "Grilled Salmon", revenue: 4300 },
        { name: "Tiramisu", revenue: 3600 },
      ]
    },
    {
      id: "3",
      month: "March",
      year: 2023,
      revenue: 45200,
      expenses: 29000,
      profit: 16200,
      topSellingItems: [
        { name: "Grilled Salmon", revenue: 5400 },
        { name: "Spaghetti Carbonara", revenue: 4900 },
        { name: "Chocolate Cake", revenue: 3800 },
      ]
    },
    {
      id: "4",
      month: "April",
      year: 2023,
      revenue: 43800,
      expenses: 27800,
      profit: 16000,
      topSellingItems: [
        { name: "Spaghetti Carbonara", revenue: 5100 },
        { name: "Tiramisu", revenue: 4700 },
        { name: "Grilled Salmon", revenue: 4500 },
      ]
    },
    {
      id: "5",
      month: "May",
      year: 2023,
      revenue: 47600,
      expenses: 30200,
      profit: 17400,
      topSellingItems: [
        { name: "Grilled Salmon", revenue: 5600 },
        { name: "Spaghetti Carbonara", revenue: 5200 },
        { name: "Chocolate Cake", revenue: 4100 },
      ]
    },
    {
      id: "6",
      month: "June",
      year: 2023,
      revenue: 51200,
      expenses: 32000,
      profit: 19200,
      topSellingItems: [
        { name: "Spaghetti Carbonara", revenue: 6000 },
        { name: "Grilled Salmon", revenue: 5800 },
        { name: "Tiramisu", revenue: 4600 },
      ]
    },
    {
      id: "7",
      month: "July",
      year: 2023,
      revenue: 54800,
      expenses: 33900,
      profit: 20900,
      topSellingItems: [
        { name: "Grilled Salmon", revenue: 6400 },
        { name: "Spaghetti Carbonara", revenue: 6200 },
        { name: "Chocolate Cake", revenue: 5000 },
      ]
    },
    {
      id: "8",
      month: "August",
      year: 2023,
      revenue: 56300,
      expenses: 34700,
      profit: 21600,
      topSellingItems: [
        { name: "Spaghetti Carbonara", revenue: 6600 },
        { name: "Grilled Salmon", revenue: 6500 },
        { name: "Tiramisu", revenue: 5300 },
      ]
    },
    {
      id: "9",
      month: "September",
      year: 2023,
      revenue: 52900,
      expenses: 32800,
      profit: 20100,
      topSellingItems: [
        { name: "Grilled Salmon", revenue: 6200 },
        { name: "Spaghetti Carbonara", revenue: 6000 },
        { name: "Chocolate Cake", revenue: 4900 },
      ]
    },
    {
      id: "10",
      month: "October",
      year: 2023,
      revenue: 49500,
      expenses: 31200,
      profit: 18300,
      topSellingItems: [
        { name: "Spaghetti Carbonara", revenue: 5800 },
        { name: "Grilled Salmon", revenue: 5700 },
        { name: "Tiramisu", revenue: 4700 },
      ]
    },
    {
      id: "11",
      month: "November",
      year: 2023,
      revenue: 47200,
      expenses: 30100,
      profit: 17100,
      topSellingItems: [
        { name: "Grilled Salmon", revenue: 5500 },
        { name: "Spaghetti Carbonara", revenue: 5300 },
        { name: "Chocolate Cake", revenue: 4400 },
      ]
    },
    {
      id: "12",
      month: "December",
      year: 2023,
      revenue: 58900,
      expenses: 35900,
      profit: 23000,
      topSellingItems: [
        { name: "Spaghetti Carbonara", revenue: 6900 },
        { name: "Grilled Salmon", revenue: 6800 },
        { name: "Tiramisu", revenue: 5600 },
      ]
    },
  ];
};

const MonthlyRevenue = () => {
  const [revenueData, setRevenueData] = useState<MonthlyRevenueType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchMonthlyRevenue();
      setRevenueData(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const [selectedYear] = useState(2023);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);
  const avgMonthlyRevenue = totalRevenue / (revenueData.length || 1);

  const tableColumns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      title: 'Expenses',
      dataIndex: 'expenses',
      key: 'expenses',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      render: (value: number) => (
        <span style={{ color: value >= 0 ? 'green' : 'red', fontWeight: 500 }}>
          ${value.toLocaleString()}
        </span>
      )
    }
  ];

  const chartData = revenueData.map(item => ({
    month: item.month,
    "Spaghetti Carbonara": item.topSellingItems.find(i => i.name === "Spaghetti Carbonara")?.revenue || 0,
    "Grilled Salmon": item.topSellingItems.find(i => i.name === "Grilled Salmon")?.revenue || 0,
    "Chocolate Cake": item.topSellingItems.find(i => i.name === "Chocolate Cake")?.revenue || 0,
    "Tiramisu": item.topSellingItems.find(i => i.name === "Tiramisu")?.revenue || 0,
  }));

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Monthly Revenue Reports</h1>
      <p style={{ color: 'gray' }}>View and analyze your restaurant's monthly revenue data</p>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={0}
              prefix={<DollarOutlined />}
              valueStyle={{ fontWeight: 600 }}
            />
            <div style={{ fontSize: 12, color: 'gray' }}>For the year {selectedYear}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={totalExpenses}
              precision={0}
              prefix={<FallOutlined />}
              valueStyle={{ fontWeight: 600 }}
            />
            <div style={{ fontSize: 12, color: 'gray' }}>For the year {selectedYear}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Profit"
              value={totalProfit}
              precision={0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: 'green', fontWeight: 600 }}
            />
            <div style={{ fontSize: 12, color: 'gray' }}>For the year {selectedYear}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Monthly Revenue"
              value={avgMonthlyRevenue}
              precision={0}
              prefix={<BarChartOutlined />}
              valueStyle={{ fontWeight: 600 }}
            />
            <div style={{ fontSize: 12, color: 'gray' }}>Per month in {selectedYear}</div>
          </Card>
        </Col>
      </Row>

      <Card title="Revenue Overview" style={{ marginTop: 24 }} extra={
        <Button icon={<DownloadOutlined />} type="default">
          Download Report
        </Button>
      }>
        <Tabs defaultActiveKey="chart" items={[
          {
            key: 'chart',
            label: 'Chart',
            children: (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                  <Bar dataKey="expenses" fill="#f97316" name="Expenses" />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            )
          },
          {
            key: 'table',
            label: 'Table',
            children: (
              <Table
                dataSource={revenueData}
                columns={tableColumns}
                rowKey="id"
                loading={isLoading}
                pagination={false}
              />
            )
          }
        ]} />
      </Card>

      <Card title="Top Selling Items" style={{ marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Spaghetti Carbonara" stroke="#8b5cf6" />
            <Line type="monotone" dataKey="Grilled Salmon" stroke="#f97316" />
            <Line type="monotone" dataKey="Chocolate Cake" stroke="#10b981" />
            <Line type="monotone" dataKey="Tiramisu" stroke="#0ea5e9" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MonthlyRevenue;
