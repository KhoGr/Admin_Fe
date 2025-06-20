// MonthlyFinanceSummaryPage.tsx
// ------------------------------------------------------
// Hiển thị báo cáo tài chính hằng tháng với tiền VNĐ
// Thêm tính năng hiển thị % tăng trưởng tháng này so với tháng trước
// ------------------------------------------------------
import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  Tabs,
  Table,
  Button,
  Skeleton,
  message,
} from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  BarChartOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts';

//---------------------------------------------
// 1. Kiểu dữ liệu phù hợp model Sequelize
//---------------------------------------------
export interface MonthlyFinanceSummaryType {
  id: number;
  month: string; // "YYYY-MM"
  total_revenue: number;
  total_payroll: number;
  total_orders: number;
  note?: string | null;
  profit?: number;
  growthRate?: number; // phần trăm tăng trưởng so với tháng trước
}

//---------------------------------------------
// 2. Mock API (thay bằng real API khi có)
//---------------------------------------------
const fetchMonthlyFinanceSummary = async (
  year: number,
): Promise<MonthlyFinanceSummaryType[]> => {
  try {
    const res = await fetch(`/api/finance/monthly?year=${year}`);
    if (!res.ok) throw new Error('API error');
    const data = (await res.json()) as MonthlyFinanceSummaryType[];
    return calculateDerivedFields(data);
  } catch (err) {
    message.warning('Đang dùng mock data (chưa có API)');
    const mock = [
      { id: 1, month: `${year}-01`, total_revenue: 42500000, total_payroll: 28000000, total_orders: 650, note: null },
      { id: 2, month: `${year}-02`, total_revenue: 38900000, total_payroll: 26500000, total_orders: 580, note: null },
      { id: 3, month: `${year}-03`, total_revenue: 45200000, total_payroll: 29000000, total_orders: 720, note: null },
      { id: 4, month: `${year}-04`, total_revenue: 43800000, total_payroll: 27800000, total_orders: 680, note: null },
      { id: 5, month: `${year}-05`, total_revenue: 47600000, total_payroll: 30200000, total_orders: 750, note: null },
      { id: 6, month: `${year}-06`, total_revenue: 51200000, total_payroll: 32000000, total_orders: 790, note: null },
      { id: 7, month: `${year}-07`, total_revenue: 54800000, total_payroll: 33900000, total_orders: 810, note: null },
      { id: 8, month: `${year}-08`, total_revenue: 56300000, total_payroll: 34700000, total_orders: 835, note: null },
      { id: 9, month: `${year}-09`, total_revenue: 52900000, total_payroll: 32800000, total_orders: 770, note: null },
      { id: 10, month: `${year}-10`, total_revenue: 49500000, total_payroll: 31200000, total_orders: 720, note: null },
      { id: 11, month: `${year}-11`, total_revenue: 47200000, total_payroll: 30100000, total_orders: 690, note: null },
      { id: 12, month: `${year}-12`, total_revenue: 58900000, total_payroll: 35900000, total_orders: 820, note: null },
    ];
    return calculateDerivedFields(mock);
  }
};

const calculateDerivedFields = (data: MonthlyFinanceSummaryType[]): MonthlyFinanceSummaryType[] => {
  return data.map((d, i, arr) => {
    const profit = d.total_revenue - d.total_payroll;
    const prev = arr[i - 1];
    const growthRate = prev ? ((d.total_revenue - prev.total_revenue) / prev.total_revenue) * 100 : 0;
    return { ...d, profit, growthRate };
  });
};

//---------------------------------------------
// 3. Component chính
//---------------------------------------------
const MonthlyFinanceSummaryPage = () => {
  const [data, setData] = useState<MonthlyFinanceSummaryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [year] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetchMonthlyFinanceSummary(year);
      setData(res);
      setLoading(false);
    };
    load();
  }, [year]);

  const formatCurrency = (value: number | string | undefined) => {
    if (typeof value === 'number') {
      return `${value.toLocaleString('vi-VN')} ₫`;
    }
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return `${Number(value).toLocaleString('vi-VN')} ₫`;
    }
    return value;
  };
  const formatPercent = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;

  const totalRevenue = data.reduce((s, v) => s + v.total_revenue, 0);
  const totalPayroll = data.reduce((s, v) => s + v.total_payroll, 0);
  const totalProfit = data.reduce((s, v) => s + (v.profit || 0), 0);
  const avgMonthlyRevenue = totalRevenue / (data.length || 1);

  const columns = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    {
      title: 'Doanh thu',
      dataIndex: 'total_revenue',
      key: 'revenue',
      render: (v: number) => formatCurrency(v),
    },
    {
      title: 'Chi lương',
      dataIndex: 'total_payroll',
      key: 'payroll',
      render: (v: number) => formatCurrency(v),
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      render: (v: number) => (
        <span style={{ color: v >= 0 ? 'green' : 'red', fontWeight: 500 }}>{formatCurrency(v)}</span>
      ),
    },
    {
      title: 'Tăng trưởng',
      dataIndex: 'growthRate',
      key: 'growth',
      render: (v: number) => (
        <span style={{ color: v >= 0 ? 'green' : 'red' }}>{formatPercent(v)}</span>
      ),
    },
    { title: 'Số đơn', dataIndex: 'total_orders', key: 'orders' },
  ];

  const chartData = data.map((d) => ({
    month: d.month.slice(5),
    Revenue: d.total_revenue,
    Payroll: d.total_payroll,
    Profit: d.profit,
  }));

  if (loading) return <Skeleton active style={{ padding: 24 }} />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Tổng quan tài chính theo tháng</h1>
      <p className="text-gray-500">Năm {year}</p>

      <Row gutter={16} className="mt-6">
        <Col span={6}>
          <Card>
            <Statistic title="Tổng doanh thu" value={totalRevenue} prefix={<DollarOutlined />} valueStyle={{ fontWeight: 600 }} formatter={formatCurrency} />
            <div className="text-xs text-gray-400">Năm {year}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng chi lương" value={totalPayroll} prefix={<FallOutlined />} valueStyle={{ fontWeight: 600 }} formatter={formatCurrency} />
            <div className="text-xs text-gray-400">Năm {year}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Tổng lợi nhuận" value={totalProfit} prefix={<RiseOutlined />} valueStyle={{ color: 'green', fontWeight: 600 }} formatter={formatCurrency} />
            <div className="text-xs text-gray-400">Năm {year}</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Doanh thu TB tháng" value={avgMonthlyRevenue} prefix={<BarChartOutlined />} valueStyle={{ fontWeight: 600 }} formatter={formatCurrency} />
            <div className="text-xs text-gray-400">Năm {year}</div>
          </Card>
        </Col>
      </Row>

      <Card
        title="Biểu đồ doanh thu - lương - lợi nhuận"
        className="mt-6"
        extra={<Button icon={<DownloadOutlined />}>Download CSV</Button>}
      >
        <Tabs
          defaultActiveKey="chart"
          items={[
            {
              key: 'chart',
              label: 'Biểu đồ',
              children: (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="Revenue" name="Doanh thu" fill="#8b5cf6" />
                    <Bar dataKey="Payroll" name="Chi lương" fill="#f97316" />
                    <Bar dataKey="Profit" name="Lợi nhuận" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ),
            },
            {
              key: 'table',
              label: 'Bảng chi tiết',
              children: (
                <Table dataSource={data} columns={columns} rowKey="id" pagination={false} />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default MonthlyFinanceSummaryPage;