/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../redux/slices/auth.slice';
import { RootState, AppDispatch } from '../../redux/store';
import {
  Upload,
  Form,
  Input,
  Button,
  Card,
  Avatar,
  message,
  Select,
} from 'antd';
import {
  UploadOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import userApi from '../../api/userApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const EditProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state: RootState) => state.auth);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const addressApi = {
    getCities: () => axios.get('https://provinces.open-api.vn/api/p/'),
    getDistricts: (cityCode: string) =>
      axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`),
    getWards: (districtCode: string) =>
      axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`),
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        phone: user.phone,
        role: user.role,
      });
      setAvatar(user.avatar || null);

      addressApi.getCities().then(async (res) => {
        const citiesData = res.data;
        setCities(citiesData);

        if (user.address) {
          const parts = user.address.split(',').map((s) => s.trim());
          if (parts.length >= 4) {
            const street = parts[0];
            const wardName = parts[1].replace(/^Xã |^Phường |^Thị trấn /, '').trim();
            const districtName = parts[2].replace(/^Quận |^Huyện |^Thành phố /, '').trim();
            const cityName = parts[3].replace(/^Tỉnh |^Thành phố /, '').trim();

            const city = citiesData.find((c: any) => c.name.includes(cityName));
            if (!city) return;

            const districtRes = await addressApi.getDistricts(city.code);
            const districtsData = districtRes.data.districts;
            const district = districtsData.find((d: any) => d.name.includes(districtName));
            if (!district) return;

            const wardRes = await addressApi.getWards(district.code);
            const wardsData = wardRes.data.wards;
            const ward = wardsData.find((w: any) => w.name.includes(wardName));
            if (!ward) return;

            setDistricts(districtsData);
            setWards(wardsData);

            form.setFieldsValue({
              city: city.code,
              district: district.code,
              ward: ward.code,
              street,
            });
          }
        }
      });
    }
  }, [user, form]);

  const handleCityChange = async (code: string) => {
    form.setFieldsValue({ city: code, district: undefined, ward: undefined });
    const res = await addressApi.getDistricts(code);
    setDistricts(res.data.districts);
    setWards([]);
  };

  const handleDistrictChange = async (code: string) => {
    form.setFieldsValue({ district: code, ward: undefined });
    const res = await addressApi.getWards(code);
    setWards(res.data.wards);
  };

  const handleWardChange = (code: string) => {
    form.setFieldsValue({ ward: code });
  };

  const handleUpdate = async (values: any) => {
    try {
      const city = cities.find((c) => c.code === values.city)?.name || '';
      const district = districts.find((d) => d.code === values.district)?.name || '';
      const ward = wards.find((w) => w.code === values.ward)?.name || '';
      const address = `${values.street}, ${ward}, ${district}, ${city}`;

      await userApi.updateUserProfile({ ...values, avatar, address });
      message.success('Cập nhật thông tin thành công!');
      dispatch(getMe());
      navigate('/account/profile');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Cập nhật thất bại, thử lại!');
    }
  };

  const handleUpload = async (file: File) => {
    if (!userId) {
      message.error('Không tìm thấy user_id!');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('user_id', userId.toString()); // ✅ Gửi user_id

      const response = await userApi.updateAvatar(formData);
      if (response.status === 200) {
        message.success('Cập nhật ảnh đại diện thành công!');
        setAvatar(response.data.newSrc);
        dispatch(getMe());
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Cập nhật ảnh đại diện thất bại!');
    }
    setUploading(false);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f0f2f5, #d6e4ff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card
        className="w-full max-w-[600px]"
        bodyStyle={{ padding: 24 }}
        style={{
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: 600,
        }}
      >
        <h2 className="text-center text-2xl font-semibold mb-6">Chỉnh Sửa Hồ Sơ</h2>
        <div className="flex justify-center mb-6">
          <ImgCrop>
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
            >
              <Avatar size={100} src={avatar} icon={<UserOutlined />} />
              <Button icon={<UploadOutlined />} loading={uploading} className="block mx-auto mt-3">
                Thay đổi ảnh
              </Button>
            </Upload>
          </ImgCrop>
        </div>

        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Username" name="username">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true },
              { pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/, message: 'Số điện thoại không hợp lệ!' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item label="Tỉnh / Thành phố" name="city" rules={[{ required: true }]}>
            <Select placeholder="Chọn tỉnh/thành" onChange={handleCityChange}>
              {cities.map((city) => (
                <Option key={city.code} value={city.code}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Quận / Huyện" name="district" rules={[{ required: true }]}>
            <Select placeholder="Chọn quận/huyện" onChange={handleDistrictChange}>
              {districts.map((district) => (
                <Option key={district.code} value={district.code}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Phường / Xã" name="ward" rules={[{ required: true }]}>
            <Select placeholder="Chọn phường/xã" onChange={handleWardChange}>
              {wards.map((ward) => (
                <Option key={ward.code} value={ward.code}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Số nhà, tên đường" name="street" rules={[{ required: true }]}>
            <Input prefix={<EnvironmentOutlined />} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Cập Nhật
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfileForm;
