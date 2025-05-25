import React, { useState, useEffect } from 'react';
import { Input, Button, Modal, Form, Typography, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, AppDispatch } from '../../redux/store';
import CategoryTable from '../../components/category/CategoryTable';
import {
  createCategory,
  fetchCategories,
  updateCategory,
  searchCategories
} from '../../redux/slices/categories.slice';
import { Category } from '../../types/category';

interface FormData {
  name: string;
  description?: string;
}

const CategoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const { data: categories } = useSelector((state: RootState) => state.categories);

  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onSearch = () => {
    dispatch(searchCategories(searchTerm));
  };

  const onSubmit = (data: FormData) => {
    dispatch(createCategory(data));
    reset();
    setOpen(false);
  };

  const handleDetail = (category: Category) => {
    setSelectedCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
    });
    setDetailOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;
    try {
      const values = await form.validateFields();
      await dispatch(updateCategory({ id: selectedCategory.id, data: values })).unwrap();
      setDetailOpen(false);
    } catch (err) {
      console.error('Cập nhật thất bại', err);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Typography.Title level={4}>Danh sách danh mục</Typography.Title>

<div style={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', // Thêm dòng này để căn giữa theo chiều dọc
  marginBottom: 24,
  gap: 8 // Tạo khoảng cách giữa các phần tử
}}>
  <Space direction="horizontal" align="center"> {/* Thêm align="center" */}
    <Input
      placeholder="Tìm kiếm danh mục..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ 
        width: 500, // Thay minWidth bằng width cố định
        height: 32 // Thêm chiều cao cố định
      }}
    />
    <Button 
      type="default" 
      onClick={onSearch}
      style={{ height: 32 }} // Đồng bộ chiều cao với Input
    >
      Tìm kiếm
    </Button>
  </Space>

  <Button 
    type="primary" 
    onClick={() => setOpen(true)}
    style={{ height: 32 }} // Đồng bộ chiều cao
  >
    + Thêm danh mục
  </Button>
</div>

      <CategoryTable
        categories={categories}
        onDetail={handleDetail}
      />

      {/* Modal thêm danh mục */}
      <Modal
        title="Thêm danh mục mới"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Input
              placeholder="Tên danh mục"
              {...register('name', { required: true })}
            />
            <Input.TextArea
              placeholder="Mô tả"
              rows={3}
              {...register('description')}
            />
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </div>
          </Space>
        </form>
      </Modal>

      {/* Modal chi tiết danh mục */}
      <Modal
        title="Chi tiết danh mục"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Tên danh mục" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
