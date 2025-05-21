import React, { useState, useEffect } from 'react';
import {
  TextField,
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
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
import { Modal, Input, Form } from 'antd';
import { Category } from '../../types/category';

interface FormData {
  name: string;
  description?: string;
}

const CategoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Danh sách danh mục
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Tìm kiếm danh mục..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            input: { color: theme.palette.text.primary },
            label: { color: theme.palette.text.secondary }
          }}
        />
        <Button variant="outlined" onClick={onSearch}>
          Tìm kiếm
        </Button>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Thêm danh mục
        </Button>
      </Box>

      <CategoryTable
        categories={categories}
        onDetail={handleDetail}
      />

      {/* Modal thêm danh mục */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
          Thêm danh mục mới
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.default }}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            <TextField
              label="Tên danh mục"
              fullWidth
              {...register('name', { required: true })}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              InputProps={{ style: { color: theme.palette.text.primary } }}
            />
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              {...register('description')}
              InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
              InputProps={{ style: { color: theme.palette.text.primary } }}
            />
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="inherit">Hủy</Button>
              <Button type="submit" variant="contained">Lưu</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal xem chi tiết/sửa */}
      <Modal
        open={detailOpen}
        title="Chi tiết danh mục"
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
    </Container>
  );
};

export default CategoryPage;
