import React, { useState } from 'react';
import { Modal, Form, Input, Select, Avatar, Upload, Button, message, InputNumber } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';
import { MenuItem } from '../../types/menuItem';
import { Category } from '../../types/category';

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  categories: Category[];
  mode: 'add' | 'edit';
  initialData?: Partial<MenuItem>;
  onUploadImage: (file: File) => void;
}

const AddOrUpdateMenuItemModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  categories,
  mode,
  initialData = {},
  onUploadImage,
}) => {
  const [form] = Form.useForm();

  const isEditMode = mode === 'edit';

  React.useEffect(() => {
    if (open) {
      form.setFieldsValue(initialData);
    }
  }, [open, initialData]);

  return (
    <Modal
      title={isEditMode ? 'Chi tiết món ăn' : 'Thêm món ăn mới'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Tên món ăn" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Giảm giá (%)"
          name="discount_percent"
          rules={[
            { required: true, message: 'Vui lòng nhập giảm giá' },
            {
              min: 0,
              max: 50,
              message: 'Giảm giá phải từ 0 đến 50%',
            },
          ]}
        >
          <InputNumber
            min={0}
            max={50}
            style={{ width: '100%' }}
            formatter={(value) => `${value}%`}
          />
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
                  onUploadImage(file);
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
              danger
              onClick={() => form.setFieldsValue({ image_url: null })}
              style={{ marginTop: 8 }}
            >
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
  );
};

export default AddOrUpdateMenuItemModal;
