import React from 'react';
import { Table, Button, Space, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { deleteCategory } from '../../redux/slices/categories.slice';
import { setMessage } from '../../redux/slices/message.slice';
import { Category } from '../../types/category';

const { Text } = Typography;

interface CategoryTableProps {
  categories: Category[];
  onDetail: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, onDetail }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      dispatch(setMessage({ message: 'Xóa danh mục thành công', type: 'success' }));
    } catch (err) {
      dispatch(setMessage({ message: (err as string) || 'Xóa thất bại', type: 'error' }));
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => onDetail(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={categories}
      rowKey="id"
      locale={{
        emptyText: <Text style={{ textAlign: 'center', margin: 16 }}>Không có danh mục nào</Text>
      }}
      bordered
      pagination={{ position: ['bottomCenter'] }}
    />
  );
};

export default CategoryTable;