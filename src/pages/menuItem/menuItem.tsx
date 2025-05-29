import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
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
  Modal,
  Select,
  Form,
  Row,
  Col,
  Space,
  Avatar,
  Upload,
  message,
} from 'antd';

import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';

import { MenuItem } from '../../types/menuItem';
import { CreateMenuItemDTO } from '../../types/menuItem';
import { Category } from '../../types/category';
import categoryApi from '../../api/categoryApi';
import MenuItemTable from '../../components/menuItem/MenuItemTable';
import menuItemApi from 'src/api/menuItemApi';

const { Option } = Select;
const { TextArea } = Input;

const MenuItemPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [uploading, setUploading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

  const { data: menuItems } = useSelector((state: RootState) => state.menuItems);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm<CreateMenuItemDTO>();

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
      formData.append('image', file);
      if (!selectedItem) throw new Error('No menu item selected');
      const response = await menuItemApi.updateImage(Number(selectedItem.item_id), formData);

      if (response.status === 200) {
        form.setFieldsValue({ image_url: response.data.image_url });
        message.success('Upload ảnh thành công!');
      }
    } catch (error: any) {
      console.error('Upload ảnh thất bại:', error);
      message.error('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      const values = await form.validateFields();
      await dispatch(updateMenuItem({ id: Number(selectedItem.item_id), data: values })).unwrap();
      setDetailOpen(false);
    } catch (err) {
      console.error('Cập nhật thất bại', err);
    }
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

      {/* Modal Thêm */}
<Modal
  title="Thêm món ăn mới"
  open={open}
  onCancel={() => setOpen(false)}
  onOk={() => form.submit()}
  okText="Lưu"
  cancelText="Hủy"
>
<Form
  layout="vertical"
  form={form}
  onFinish={(values) => {
    dispatch(createMenuItem(values));
    form.resetFields();
    setOpen(false);
  }}
>
    <Form.Item label="Tên món ăn" name="name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item label="Giảm giá (%)" name="discount_percent">
      <Input type="number" />
    </Form.Item>

    <Form.Item label="Mô tả" name="description">
      <TextArea rows={3} />
    </Form.Item>

    <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
      <Input
        type="text"
        addonAfter="₫"
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          form.setFieldsValue({ price: value ? parseInt(value) : 0 });
        }}
      />
    </Form.Item>

    <Form.Item label="Ảnh món ăn" name="image_url">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ImgCrop>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
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
              handleUpload(file); // Gọi logic upload và cập nhật form.setFieldsValue
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
        <Button danger onClick={() => form.setFieldsValue({ image_url: null })} style={{ marginTop: 8 }}>
          Xóa ảnh
        </Button>
      </div>
    </Form.Item>

    <Form.Item label="Trạng thái" name="is_available" initialValue={true}>
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




      {/* Modal Chi tiết */}
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
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Giá" name="price">
            <Input
              type="text"
              addonAfter="₫"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                form.setFieldsValue({ price: value ? parseInt(value) : 0 });
              }}
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
              <Button danger onClick={() => form.setFieldsValue({ image_url: null })} style={{ marginTop: 8 }}>
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
    </div>
  );
};

export default MenuItemPage;
