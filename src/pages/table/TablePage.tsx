import React, { useEffect, useState } from 'react';
import { Table as AntTable, Button, Space, Tag, message, Drawer } from 'antd';
import tableApi from '../../api/tableApi';
import { Table as TableModel, CreateTableDto, UpdateTableDto } from '../../types/table';
import TableForm, { TableFormData } from '../../components/table/TableForm';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // ⚠️ server URL

const TablePage: React.FC = () => {
  const [tables, setTables] = useState<TableModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<TableModel | null>(null);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const data = await tableApi.getAll();
      const sortedData = data.sort((a, b) => Number(a.table_number) - Number(b.table_number));
      setTables(sortedData);
    } catch (err) {
      message.error('Không thể tải danh sách bàn.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();

    socket.on('table-booked', (bookedTable) => {

      fetchTables()
      message.info(`Bàn số ${bookedTable.table_number} đã được đặt.`);
      console.log("🟢 Socket connected:", socket.id);
    });

    // 👉 Thêm sự kiện 'table-updated' để fetch lại
    socket.on('table-updated', () => {
      console.log('📡 Nhận sự kiện table-updated → gọi fetchTables');
      fetchTables();
    });

    return () => {
      socket.off('table-booked');
      socket.off('table-updated');
      console.log("🔴 Socket disconnected");
    };
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) {
      message.error('ID không hợp lệ');
      return;
    }
    try {
      await tableApi.delete(id);
      message.success('Xóa bàn thành công');
      fetchTables();
    } catch (err) {
      message.error('Xóa bàn thất bại');
    }
  };

  const handleFormSubmit = async (formData: TableFormData) => {
    try {
      if (selectedTable?.table_id) {
        await tableApi.update(selectedTable.table_id, formData as UpdateTableDto);
        message.success('Cập nhật bàn thành công');
      } else {
        await tableApi.create(formData as CreateTableDto);
        message.success('Tạo bàn mới thành công');
      }

      fetchTables(); // tự cập nhật tab hiện tại
      socket.emit('table-updated'); // thông báo các tab khác cập nhật
      setFormVisible(false);
      setSelectedTable(null);
    } catch (err) {
      message.error('Thao tác thất bại');
    }
  };

  const columns = [
    {
      title: 'Tầng',
      dataIndex: 'floor',
      key: 'floor',
    },
    {
      title: 'Số bàn',
      dataIndex: 'table_number',
      key: 'table_number',
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'seat_count',
      key: 'seat_count',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        let label = 'Còn trống';
        if (status === 'occupied') {
          color = 'red';
          label = 'Đang sử dụng';
        } else if (status === 'reserved') {
          color = 'orange';
          label = 'Đã đặt';
        } else if (status === 'unavailable') {
          color = 'gray';
          label = 'Không sử dụng';
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (note: string) => note || '-',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: TableModel) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedTable(record);
              setFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            onClick={() => {
              if (record.table_id) {
                handleDelete(record.table_id);
              } else {
                message.error('Không tìm thấy ID của bàn này.');
              }
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý bàn</h2>
      <Button
        type="primary"
        className="mb-4"
        onClick={() => {
          setSelectedTable(null);
          setFormVisible(true);
        }}
      >
        Thêm bàn mới
      </Button>

      <AntTable
        columns={columns}
        dataSource={tables}
        rowKey={(record) => record.table_id?.toString() || Math.random().toString()}
        loading={loading}
      />

      <Drawer
        open={formVisible}
        onClose={() => {
          setFormVisible(false);
          setSelectedTable(null);
        }}
        title={selectedTable ? 'Cập nhật bàn' : 'Tạo bàn mới'}
        width={400}
      >
        <TableForm
          initialValues={selectedTable || undefined}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      </Drawer>
    </div>
  );
};

export default TablePage;
