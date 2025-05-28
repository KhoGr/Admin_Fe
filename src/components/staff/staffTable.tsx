import React, { useState } from 'react';
import { Table, Typography, Button, Space, Popconfirm, message } from 'antd';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { StaffModel } from '../../types/staff';
import staffApi from '../../api/staffApi';

interface StaffTableProps {
  staffList: StaffModel[];
  onDetail: (staff: StaffModel) => void;
  onReload?: () => void;
}

const StaffTable: React.FC<StaffTableProps> = ({ staffList = [], onDetail, onReload }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleDelete = async (userId: number) => {
    try {
      await staffApi.delete(userId);
      message.success('Xóa nhân viên thành công');
      onReload?.();
    } catch (error) {
      message.error('Xóa nhân viên thất bại');
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (_: any, __: StaffModel, index: number) => (page - 1) * rowsPerPage + index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: ['user', 'name'],
      render: (text: string) => text || '—',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'account', 'email'],
      render: (text: string) => text || '—',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      render: (text: string) => text || '—',
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      render: (salary: number) =>
        salary
          ? salary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
          : '—',
    },
    {
      title: 'Loại làm việc',
      dataIndex: 'working_type',
      render: (text: string) => text || '—',
    },
    {
      title: 'Ngày vào làm',
      dataIndex: 'joined_date',
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString('vi-VN') : '—',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      render: (text: string) => text || '—',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, staff: StaffModel) => (
        <Space>
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() => onDetail(staff)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(staff.user_id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const paginatedData = staffList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      {user && (
        <Typography.Text strong>
          Xin chào, {user.name} ({user.email})
        </Typography.Text>
      )}

      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="staff_id"
        pagination={false}
        style={{ marginTop: 16 }}
      />

      {/* Custom Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Trang trước
        </Button>
        <Typography>
          Trang {page} / {Math.ceil(staffList.length / rowsPerPage) || 1}
        </Typography>
        <Button
          disabled={page >= Math.ceil(staffList.length / rowsPerPage)}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </Button>
      </div>
    </>
  );
};

export default StaffTable;
