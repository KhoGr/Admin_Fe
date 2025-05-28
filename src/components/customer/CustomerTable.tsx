import React, { useState } from 'react';
import { Table, Typography, Space, Button, Popconfirm } from 'antd';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

import { CustomerModel } from '../../types/Customer';
import customerApi from '../../api/customerApi';
import { setMessage } from '../../redux/slices/message.slice';
import { RootState } from '../../redux/store';

interface CustomerTableProps {
  customers: CustomerModel[];
  onDetail: (customer: CustomerModel) => void;
  onReload?: () => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onDetail, onReload }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const handleDelete = async (userId: number) => {
    try {
      await customerApi.delete(userId);
      dispatch(setMessage({ message: 'Xóa khách hàng thành công', type: 'success' }));
      onReload?.();
    } catch (error) {
      dispatch(setMessage({ message: 'Xóa khách hàng thất bại', type: 'error' }));
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: any, __: CustomerModel, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: ['user_info', 'name'],
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: ['user_info', 'account', 'email'],
      key: 'email',
    },
    {
      title: 'Điểm tích lũy',
      dataIndex: 'loyalty_point',
      key: 'loyalty_point',
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'total_spent',
      key: 'total_spent',
      render: (value: number) =>
        Math.min(value, 9999999999).toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }),
    },
    {
      title: 'Hạng',
      dataIndex: 'membership_level',
      key: 'membership_level',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (note: string | null) => note || '—',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: CustomerModel) => (
        <Space>
          <Button icon={<InfoCircleOutlined />} onClick={() => onDetail(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá?"
            onConfirm={() => handleDelete(record.user_id)}
            okText="Xoá"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <>
      {user && (
        <Typography.Text style={{ display: 'block', marginBottom: 16 }}>
          Xin chào, {user.name} ({user.email})
        </Typography.Text>
      )}

      <Table
        columns={columns}
        dataSource={customers}
        rowKey={(record) => record.customer_id}
        pagination={pagination}
        onChange={handleTableChange}
        locale={{ emptyText: 'Không có khách hàng nào.' }}
      />
    </>
  );
};

export default CustomerTable;
