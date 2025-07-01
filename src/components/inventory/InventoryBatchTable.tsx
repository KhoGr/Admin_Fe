import React from 'react';
import {
  Table,
  Typography,
  DatePicker,
  Space,
  Button,
  Popconfirm,
  message,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { InventoryBatchResponse } from '../../types/inventoryBatch';

const { Text } = Typography;

const formatVND = (value: string | number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(typeof value === 'string' ? parseFloat(value) : value);

interface Props {
  selectedMonth: Dayjs;
  onMonthChange: (month: Dayjs) => void;
  batches: InventoryBatchResponse[];
  onEdit: (batch: InventoryBatchResponse) => void;
  onDelete: (id: number) => void;
}

const InventoryBatchTable: React.FC<Props> = ({
  selectedMonth,
  onMonthChange,
  batches,
  onEdit,
  onDelete,
}) => {
  const filtered = batches.filter(batch =>
    dayjs(batch.time_added).isSame(selectedMonth, 'month')
  );

  const total = filtered.reduce((sum, batch) => {
    const value =
      typeof batch.total_value === 'string'
        ? parseFloat(batch.total_value)
        : batch.total_value;
    return sum + value;
  }, 0);

  const columns = [
    {
      title: 'Item Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (value: string | number) => formatVND(value),
    },
    {
      title: 'Total Value',
      dataIndex: 'total_value',
      key: 'total_value',
      render: (value: string | number) => <strong>{formatVND(value)}</strong>,
    },
    {
      title: 'Time Added',
      dataIndex: 'time_added',
      key: 'time_added',
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: InventoryBatchResponse) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Update
          </Button>
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      <DatePicker
        picker="month"
        value={selectedMonth}
        onChange={(date) => {
          if (date) onMonthChange(date);
        }}
        style={{ marginBottom: 16 }}
      />

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
         scroll={{ x: 'max-content' }}

        footer={() => (
          <Text strong>
            Tổng chi phí nguyên liệu: {formatVND(total)}
          </Text>
        )}
      />
    </div>
  );
};

export default InventoryBatchTable;
