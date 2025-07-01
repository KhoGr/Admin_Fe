import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tabs,
  Button,
  Skeleton,
  message,
} from 'antd';
import {
  DollarOutlined,
  FallOutlined,
  RiseOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import monthlyFinanceApi from '../../api/monthlyFinanceApi';
import ExportCSVButton from '../../components/monthly/ExportCSVButton';
import AddMonthlySummaryModal from '../../components/monthly/AddMonthlySummaryModal';

type MonthlyFinanceData = {
  id?: string | number;
  month: string;
  total_revenue: string | number;
  total_payroll: string | number;
  total_material_cost: string | number;
  total_orders?: number;
  [key: string]: any;
};

const calculateDerivedFields = (
  data: MonthlyFinanceData[]
): (MonthlyFinanceData & { profit: number; growthRate: number })[] => {
  return data.map((d, i, arr) => {
    const profit =
      parseFloat(d.total_revenue as string) -
      parseFloat(d.total_payroll as string);
    const prev = arr[i - 1];
    const growthRate = prev
      ? ((parseFloat(d.total_revenue as string) -
          parseFloat(prev.total_revenue as string)) /
          parseFloat(prev.total_revenue as string)) *
        100
      : 0;
    return { ...d, profit, growthRate };
  });
};

const MonthlyFinanceSummaryPage = () => {
  const [data, setData] = useState<
    (MonthlyFinanceData & { profit: number; growthRate: number })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const year = new Date().getFullYear();

  const load = async () => {
    try {
      setLoading(true);
      const res = await monthlyFinanceApi.getAll();
      const filtered = res.data.filter((d: MonthlyFinanceData) =>
        d.month.startsWith(`${year}`)
      );
      const sorted = [...filtered].sort((a, b) =>
        a.month.localeCompare(b.month)
      );
      const withDerived = calculateDerivedFields(sorted);
      setData(withDerived);
    } catch (err) {
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [year]);

  const formatCurrency = (value: string | number) => {
    const n = Number(value);
    return isNaN(n) ? value : `${n.toLocaleString('vi-VN')} ₫`;
  };

  const formatPercent = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;

  const totalRevenue = data.reduce(
    (s, v) => s + parseFloat(String(v.total_revenue)),
    0
  );
  const totalPayroll = data.reduce(
    (s, v) => s + parseFloat(String(v.total_payroll)),
    0
  );
  const totalProfit = data.reduce((s, v) => s + (v.profit || 0), 0);
  const avgMonthlyRevenue = totalRevenue / (data.length || 1);

  const columns = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    {
      title: 'Doanh thu',
      dataIndex: 'total_revenue',
      key: 'revenue',
      render: formatCurrency,
    },
    {
      title: 'Chi lương',
      dataIndex: 'total_payroll',
      key: 'payroll',
      render: formatCurrency,
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      render: (v: number) => (
        <span style={{ color: v >= 0 ? 'green' : 'red', fontWeight: 500 }}>
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      title: 'Tăng trưởng',
      dataIndex: 'growthRate',
      key: 'growth',
      render: (v: number) => (
        <span style={{ color: v >= 0 ? 'green' : 'red' }}>
          {formatPercent(v)}
        </span>
      ),
    },
    {
      title: 'Số đơn',
      dataIndex: 'total_orders',
      key: 'orders',
    },
    {
  title: 'Chi phí nguyên liệu',
  dataIndex: 'total_material_cost',
  key: 'material_cost',
  render: formatCurrency,
},

  ];

  const chartData = data.map((d) => ({
    month: d.month.slice(5), //chỉ lấy tháng thui
    Revenue: parseFloat(String(d.total_revenue)),
    Payroll: parseFloat(String(d.total_payroll)),
    Profit: d.profit,
    MaterialCost: parseFloat(String(d.total_material_cost)),
  }));

  if (loading) return <Skeleton active style={{ padding: 24 }} />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">📊 Tổng quan tài chính theo tháng</h1>
      <p className="text-gray-500">Năm {year}</p>

      <Row gutter={16} className="mt-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ fontWeight: 600 }}
              formatter={formatCurrency}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng chi lương"
              value={totalPayroll}
              prefix={<FallOutlined />}
              valueStyle={{ fontWeight: 600 }}
              formatter={formatCurrency}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng lợi nhuận"
              value={totalProfit}
              prefix={<RiseOutlined />}
              valueStyle={{ color: 'green', fontWeight: 600 }}
              formatter={formatCurrency}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu TB tháng"
              value={avgMonthlyRevenue}
              prefix={<BarChartOutlined />}
              valueStyle={{ fontWeight: 600 }}
              formatter={formatCurrency}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Biểu đồ doanh thu - chi lương - lợi nhuận"
        className="mt-6"
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
              + Thêm tháng
            </Button>
            <ExportCSVButton data={data} year={year} />
          </div>
        }
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
                    <Tooltip
                      formatter={(value) => {
                        if (Array.isArray(value)) {
                          return value.map((v) => formatCurrency(v)).join(', ');
                        }
                        return formatCurrency(value);
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Revenue" name="Doanh thu" fill="#8b5cf6" />
                    <Bar dataKey="Payroll" name="Chi lương" fill="#f97316" />
                    <Bar dataKey="Profit" name="Lợi nhuận" fill="#10b981" />
                    <Bar dataKey="MaterialCost" name="Chi phí nguyên liệu" fill="#facc15" />
                  </BarChart>
                </ResponsiveContainer>
              ),
            },
            {
              key: 'table',
              label: 'Bảng chi tiết',
              children: (
                <Table
                  dataSource={data}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Modal tạo tháng */}
      <AddMonthlySummaryModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          load();
        }}
      />
    </div>
  );
};

export default MonthlyFinanceSummaryPage;
