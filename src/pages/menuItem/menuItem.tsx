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
  MenuItem as MuiMenuItem,
  useTheme,
  InputAdornment,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, AppDispatch } from '../../redux/store';
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  searchMenuItems,
} from '../../redux/slices/menuItem.slice';
import { Modal, Input, Form, Select, Upload, message, Avatar, Space } from 'antd';

import { MenuItem } from '../../types/menuItem';
import { CreateMenuItemDTO } from '../../types/menuItem';
import { Category } from '../../types/category';
import categoryApi from '../../api/categoryApi';
import MenuItemTable from '../../components/menuItem/MenuItemTable';
import menuItemApi from 'src/api/menuItemApi';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const MenuItemPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const { data: menuItems } = useSelector((state: RootState) => state.menuItems);
  const { register, handleSubmit, reset, setValue } = useForm<CreateMenuItemDTO>();

  useEffect(() => {
    dispatch(fetchMenuItems());
    categoryApi.getAll().then((res) => setCategories(res.data));
  }, [dispatch]);

  const onSearch = () => {
    dispatch(searchMenuItems({ keyword: searchTerm, category_id: selectedCategoryId }));
  };

  const onSubmit = (data: CreateMenuItemDTO) => {
    dispatch(createMenuItem(data));
    reset();
    setOpen(false);
  };

  const handleDetail = (item: MenuItem) => {
    setSelectedItem(item);
    form.setFieldsValue({
      name: item.name,
      description: item.description,
      discount_percent: item.discount_percent,

      price: item.price,
      category_id: item.category_id,
      image_url: item.image_url,
      is_available: item.is_available,
    });
    setDetailOpen(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file); // Thay 'avatar' bằng 'image' cho phù hợp

      // Gọi API upload ảnh món ăn thay vì avatar user
      if (!selectedItem) throw new Error('No menu item selected');
      const response = await menuItemApi.updateImage(selectedItem.item_id, formData);

      if (response.status === 200) {
        console.log('Upload ảnh thành công!');
        // Cập nhật URL ảnh vào form
        form.setFieldsValue({ image_url: response.data.image_url });
      }
    } catch (error: any) {
      console.error('Upload ảnh thất bại:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      const values = await form.validateFields();
      await dispatch(updateMenuItem({ id: selectedItem.item_id, data: values })).unwrap();
      setDetailOpen(false);
    } catch (err) {
      console.error('Cập nhật thất bại', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Danh sách món ăn
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Tìm kiếm món ăn..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            input: { color: theme.palette.text.primary },
            label: { color: theme.palette.text.secondary },
          }}
        />
        <Select
          allowClear
          style={{ minWidth: 200,minHeight:56 }}
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
        <Button variant="outlined" onClick={onSearch}>
          Search
        </Button>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add
        </Button>
      </Box>

      <MenuItemTable menuItems={menuItems} onDetail={handleDetail} categories={categories} />

      {/* Modal thêm món ăn */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          Thêm món ăn mới
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
            <TextField label="Tên món ăn" fullWidth {...register('name', { required: true })} />
            <TextField
              label="Giảm giá (%)"
              type="number"
              fullWidth
              {...register('discount_percent')}
            />

            <TextField label="Mô tả" fullWidth multiline rows={3} {...register('description')} />
            <TextField
              label="Giá"
              fullWidth
              type="number"
              {...register('price', {
                required: true,
                valueAsNumber: true,
                onChange: (e) => {
                  // Format giá trị khi hiển thị nhưng vẫn giữ giá trị số
                  const value = e.target.value;
                  if (value) {
                    e.target.value = value.replace(/\D/g, '');
                  }
                },
              })}
              InputProps={{
                endAdornment: <InputAdornment position="end">₫</InputAdornment>,
              }}
            />
            <TextField label="Link ảnh món ăn" fullWidth {...register('image_url')} />
            <TextField
              label="Trạng thái hiển thị"
              fullWidth
              select
              defaultValue="true"
              {...register('is_available')}
              onChange={(e) => setValue('is_available', e.target.value === 'true')}
            >
              <MuiMenuItem value="true">Hiển thị</MuiMenuItem>
              <MuiMenuItem value="false">Ẩn</MuiMenuItem>
            </TextField>
            <TextField
              label="Danh mục"
              fullWidth
              select
              {...register('category_id', { required: true })}
              onChange={(e) => setValue('category_id', Number(e.target.value))}
            >
              {categories.map((category) => (
                <MuiMenuItem key={category.id} value={category.id}>
                  {category.name}
                </MuiMenuItem>
              ))}
            </TextField>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="inherit">
                Hủy
              </Button>
              <Button type="submit" variant="contained">
                Lưu
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal xem chi tiết/sửa món ăn */}
      <Modal
        open={detailOpen}
        title="Chi tiết món ăn"
        onCancel={() => setDetailOpen(false)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Tên món ăn" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Giá" name="price">
            <Input
              type="text"
              onChange={(e) => {
                // Chỉ cho phép nhập số
                const value = e.target.value.replace(/\D/g, '');
                form.setFieldsValue({ price: value ? parseInt(value) : 0 });
              }}
              addonAfter="₫"
            />
          </Form.Item>
          <Form.Item label="Giảm giá (%)" name="discount_percent">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Ảnh món ăn" name="image_url">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ImgCrop>
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => {
                    // Kiểm tra loại file và kích thước
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                      message.error('Chỉ có thể upload file ảnh!');
                      return false;
                    }

                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error('Ảnh phải nhỏ hơn 2MB!');
                      return false;
                    }

                    handleUpload(file);
                    return false;
                  }}
                  accept="image/*"
                >
                  {form.getFieldValue('image_url') ? (
                    <Avatar
                      size={100}
                      src={form.getFieldValue('image_url')}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <Avatar size={100} icon={<UploadOutlined />} style={{ cursor: 'pointer' }} />
                  )}
                </Upload>
              </ImgCrop>
              <Button
                color="error"
                onClick={() => form.setFieldsValue({ image_url: null })}
                style={{ marginTop: 8 }}
              >
                Xóa ảnh
              </Button>
            </div>
          </Form.Item>

          <Form.Item label="Trạng thái hiển thị" name="is_available">
            <Select>
              <Option value={true}>Hiển thị</Option>
              <Option value={false}>Ẩn</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Danh mục" name="category_id">
            <Select>
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default MenuItemPage;
