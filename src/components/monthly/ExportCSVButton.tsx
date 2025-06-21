// src/components/ExportCSVButton.tsx
import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import Papa from 'papaparse';

interface Props {
  data: any[];
  year?: number;
  fileName?: string;
}

const ExportCSVButton: React.FC<Props> = ({
  data,
  year = new Date().getFullYear(),
  fileName = 'finance-summary',
}) => {
  const handleExportCSV = () => {
    const exportData = data.map((item) => ({
      Tháng: item.month,
      'Doanh thu (VNĐ)': parseFloat(item.total_revenue).toFixed(2),
      'Chi lương (VNĐ)': parseFloat(item.total_payroll).toFixed(2),
      'Lợi nhuận (VNĐ)': item.profit?.toFixed(2) ?? '0',
      'Tăng trưởng (%)': item.growthRate?.toFixed(2) ?? '0',
      'Số đơn hàng': item.total_orders,
    }));

    const csv = Papa.unparse(exportData);

    // ✅ Thêm BOM để fix lỗi font tiếng Việt
    const BOM = '\uFEFF';

    const blob = new Blob([BOM + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}-${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
      Download CSV
    </Button>
  );
};

export default ExportCSVButton;
