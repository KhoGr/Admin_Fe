// MenuItemPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  searchMenuItems,
} from '../../redux/slices/menuItem.slice';

import {
  Typography,
  Input,
  Button,
  Select,
  Row,
  Col,
} from 'antd';

import { MenuItem } from '../../types/menuItem';
import { Category } from '../../types/category';
import categoryApi from '../../api/categoryApi';
import MenuItemTable from '../../components/menuItem/MenuItemTable';
import AddOrUpdateMenuItemModal from '../../components/menuItem/AddOrUpdateMenuItemModal';
import menuItemApi from 'src/api/menuItemApi';

const { Option } = Select;

const MenuItemPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<MenuItem | null>(null);
  const [editOpen, setEditOpen] = useState(false); // ✅ tách rõ ràng
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const { data: menuItems } = useSelector((state: RootState) => state.menuItems);

  useEffect(() => {
    dispatch(fetchMenuItems());
    categoryApi.getAll().then((res) => setCategories(res.data));
  }, [dispatch]);

  const onSearch = () => {
    dispatch(searchMenuItems({ keyword: searchTerm, category_id: selectedCategoryId }));
  };

  const handleDetail = (item: MenuItem) => {
    // Reset trước khi mở lại
    setEditOpen(false);
    setEditModalData(null);

    // Delay mở modal để React cập nhật xong state
    setTimeout(() => {
      setEditModalData(item);
      setEditOpen(true);
    }, 0);
  };

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (!editModalData) throw new Error('No menu item selected');
      const response = await menuItemApi.updateImage(Number(editModalData.item_id), formData);

      if (response.status === 200) {
        setEditModalData((prev) => prev ? { ...prev, image_url: response.data.image_url } : prev);
      }
    } catch (error) {
      console.error('Upload ảnh thất bại:', error);
    }
  };

  const handleAddSubmit = async (values: any) => {
    await dispatch(createMenuItem(values));
    setOpen(false);
  };

  const handleUpdateSubmit = async (values: any) => {
    if (!editModalData) return;
    await dispatch(updateMenuItem({ id: Number(editModalData.item_id), data: values })).unwrap();
    setEditOpen(false);
    setEditModalData(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>Danh sách món ăn</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Input
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxHeight: 30 }}
          />
        </Col>
        <Col>
          <Select
            allowClear
            style={{ width: 200 }}
            placeholder="Chọn danh mục"
            value={selectedCategoryId}
            onChange={(value) => setSelectedCategoryId(value)}
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Button onClick={onSearch}>Tìm</Button>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setOpen(true)}>
            Thêm
          </Button>
        </Col>
      </Row>

      <MenuItemTable menuItems={menuItems} onDetail={handleDetail} categories={categories} />

      <AddOrUpdateMenuItemModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleAddSubmit}
        categories={categories}
        mode="add"
        onUploadImage={handleUpload}
      />

      <AddOrUpdateMenuItemModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditModalData(null);
        }}
        onSubmit={handleUpdateSubmit}
        categories={categories}
        mode="edit"
        initialData={editModalData || {}}
        onUploadImage={handleUpload}
      />
    </div>
  );
};

export default MenuItemPage;
