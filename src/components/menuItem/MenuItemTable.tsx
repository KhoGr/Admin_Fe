import React, { useState } from 'react';
import { Table, Image, Typography, Button, Popconfirm, message, Tag } from 'antd';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { deleteMenuItem } from '../../redux/slices/menuItem.slice';
import { setMessage } from '../../redux/slices/message.slice';
import { MenuItem } from '../../types/menuItem';
import { Category } from '../../types/category';

interface MenuItemTableProps {
  menuItems: MenuItem[];
  onDetail: (menuItem: MenuItem) => void;
  categories: Category[];
}

const MenuItemTable: React.FC<MenuItemTableProps> = ({ menuItems, onDetail, categories }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const formatPriceVND = (price: number) => {
    return (
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      })
        .format(price)
        .replace('₫', '') + '₫'
    );
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteMenuItem(id)).unwrap();
      dispatch(setMessage({ message: 'Xóa món ăn thành công', type: 'success' }));
    } catch (err) {
      dispatch(setMessage({ message: (err as string) || 'Xóa thất bại', type: 'error' }));
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên món',
      dataIndex: 'name',
    },
    {
      title: 'Ảnh',
      dataIndex: 'image_url',
      render: (url: string, record: MenuItem) =>
        url ? (
          <Image width={60} height={60} src={url} style={{ objectFit: 'cover', borderRadius: 8 }} />
        ) : (
          <Typography.Text type="secondary">Không có ảnh</Typography.Text>
        ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_id',
      render: (id: number) => categories.find((cat) => cat.id === id)?.name || 'Không rõ',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price: number) => formatPriceVND(price),
    },
    {
      title: 'Khuyến mãi',
      dataIndex: 'discount_percent',
      render: (discount: number) => `${discount}%`,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'is_available',
      render: (available: boolean) => available ? <Tag color="green">Còn bán</Tag> : <Tag color="red">Hết hàng</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: MenuItem) => (
        <>
          <Button
            type="link"
            icon={<InfoCircleOutlined />}
            onClick={() => onDetail(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa món này không?"
            onConfirm={() => handleDelete(Number(record.item_id))}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {menuItems.length === 0 ? (
        <Typography.Text style={{ display: 'block', marginTop: 32, textAlign: 'center' }}>
          Không có món nào trong thực đơn.
        </Typography.Text>
      ) : (
        <Table
          dataSource={menuItems}
          columns={columns}
          rowKey="item_id"
          pagination={{
            current: currentPage,
            pageSize,
            total: menuItems.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} món ăn`,
          }}
        />
      )}
    </>
  );
};

export default MenuItemTable;
