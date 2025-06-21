import React from 'react';
import { Table } from 'antd';

interface MonthlyFinanceSummary {
  id: number;
  month: string;
  total_revenue: string;
  total_payroll: string;
  total_orders: number;
  note?: string | null;
}

interface Props {
  data: MonthlyFinanceSummary[];
  loading?: boolean;
}

const MonthlyFinanceTable: React.FC<Props> = ({ data, loading }) => {
  // Sắp xếp theo tháng giảm dần (VD: 2025-06 -> 2025-05 -> 2025-04)
  const sortedData = [...data].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <Table
      dataSource={sortedData}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      bordered
      columns={[
        {
          title: 'Tháng',
          dataIndex: 'month',
          key: 'month',
        },
        {
          title: 'Doanh thu (VNĐ)',
          dataIndex: 'total_revenue',
          key: 'total_revenue',
          render: (value) => Number(value).toLocaleString('vi-VN'),
        },
        {
          title: 'Lương đã trả (VNĐ)',
          dataIndex: 'total_payroll',
          key: 'total_payroll',
          render: (value) => Number(value).toLocaleString('vi-VN'),
        },
        {
          title: 'Số đơn hàng',
          dataIndex: 'total_orders',
          key: 'total_orders',
        },
        {
          title: 'Ghi chú',
          dataIndex: 'note',
          key: 'note',
        },
      ]}
    />
  );
};

export default MonthlyFinanceTable;
