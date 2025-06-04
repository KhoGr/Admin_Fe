import React from 'react';
import { Table, Button, Popconfirm, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Voucher } from '../../types/voucher';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import voucherApi from '../../api/voucherApi';

interface VoucherTableProps {
  data: Voucher[];
  reload: () => void;
}

const VoucherTable: React.FC<VoucherTableProps> = ({ data, reload }) => {
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    try {
      await voucherApi.delete(id);
      message.success('Đã xoá voucher');
      reload();
    } catch (err) {
      message.error('Xoá voucher thất bại');
    }
  };

  const columns: ColumnsType<Voucher> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) =>
        type === 'flat' ? <Tag color="green">Giảm tiền</Tag> : <Tag color="blue">Giảm %</Tag>,
    },
    {
      title: 'Giá trị',
      key: 'value',
      render: (_, record) =>
        record.type === 'flat'
          ? `${Number(record.value).toLocaleString()}₫`
          : `${record.value}%`,
    },
    {
      title: 'Hạn sử dụng',
      key: 'expires_at',
      render: (_, record) =>
        record.expires_at ? dayjs(record.expires_at).format('DD/MM/YYYY') : 'Không giới hạn',
    },
    {
      title: 'Giới hạn lượt dùng',
      dataIndex: 'usage_limit',
      key: 'usage_limit',
      render: (limit) => (limit ?? 'Không giới hạn'),
    },
    {
      title: 'Giới hạn mỗi người',
      dataIndex: 'usage_limit_per_user',
      key: 'usage_limit_per_user',
      render: (limit) => (limit ?? 'Không giới hạn'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive) =>
        isActive ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Tạm ngưng</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`?id=${record.voucher_id}`)}
          >
            Chi tiết
          </Button>
          <Popconfirm
            title="Xoá voucher?"
            description={`Bạn có chắc muốn xoá voucher "${record.code}"?`}
            onConfirm={() => handleDelete(record.voucher_id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger size="small">
              Xoá
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="voucher_id"
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default VoucherTable;
