import React, { useEffect, useState } from 'react';
import {
  Typography,
  Input,
  Button,
  Space,
  Form,
  Modal,
  Select,
  InputNumber,
  DatePicker,
} from 'antd';
import StaffTable from '../../components/staff/staffTable';
import { StaffModel } from '../../types/staff';
import staffApi from '../../api/staffApi';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/slices/message.slice';
import dayjs from 'dayjs';

const { Option } = Select;

const StaffPage: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const [staffs, setStaffs] = useState<StaffModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffModel | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const fetchAllStaffs = async () => {
    try {
      const data = await staffApi.getAll();
      setStaffs(data);
    } catch (error) {
      dispatch(setMessage({ message: 'Không thể tải danh sách nhân viên', type: 'error' }));
    }
  };

  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) {
        fetchAllStaffs();
        return;
      }
      const data = await staffApi.searchByName(searchTerm);
      setStaffs(data.data);
    } catch (error) {
      dispatch(setMessage({ message: 'Không tìm thấy nhân viên', type: 'error' }));
    }
  };

  const handleReload = () => {
    fetchAllStaffs();
  };

  const handleDetail = (staff: StaffModel) => {
    setSelectedStaff(staff);
    form.setFieldsValue({
      name: staff.user?.name || '',
      username: staff.user?.username || '',
      email: staff.user?.account?.email || '',
      position: staff.position,
      salary: staff.salary,
      working_type: staff.working_type,
      joined_date: staff.joined_date ? dayjs(staff.joined_date) : null,
      note: staff.note || '',
    });
    setOpenDetail(true);
  };
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      await staffApi.create(values);
      dispatch(setMessage({ message: 'Thêm nhân viên thành công!', type: 'success' }));
      setOpenAdd(false);
      addForm.resetFields();
      fetchAllStaffs();
    } catch (error) {
      dispatch(setMessage({ message: 'Lỗi khi thêm nhân viên', type: 'error' }));
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedStaff?.user?.user_id) {
        dispatch(setMessage({ message: 'Không có ID người dùng!', type: 'error' }));
        return;
      }

      const payload = {
        ...values,
        joined_date: values.joined_date?.format('YYYY-MM-DD'),
      };

      await staffApi.update(selectedStaff.user.user_id, payload);
      dispatch(setMessage({ message: 'Cập nhật nhân viên thành công!', type: 'success' }));
      setOpenDetail(false);
      fetchAllStaffs();
    } catch (error) {
      dispatch(setMessage({ message: 'Lỗi khi cập nhật nhân viên', type: 'error' }));
    }
  };

  useEffect(() => {
    fetchAllStaffs();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>Danh sách nhân viên</Typography.Title>

      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Tìm kiếm theo tên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button onClick={handleSearch}>Tìm kiếm</Button>
          <Button type="primary" onClick={handleReload}>
            Tải lại
          </Button>
          <Button type="dashed" onClick={() => setOpenAdd(true)}>
            Thêm nhân viên
          </Button>
        </Space>
      </Space>

      <StaffTable staffList={staffs} onDetail={handleDetail} onReload={handleReload} />

      <Modal
        open={openDetail}
        title="Thông tin nhân viên"
        onCancel={() => setOpenDetail(false)}
        onOk={handleUpdate}
        okText="Lưu"
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Họ tên" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Tên đăng nhập" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Chức vụ" name="position">
            <Input />
          </Form.Item>
          <Form.Item label="Lương" name="salary">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              addonAfter="₫"
              formatter={(value) => `${Number(value).toLocaleString('vi-VN')}`}
            />
          </Form.Item>
          <Form.Item label="Hình thức làm việc" name="working_type">
            <Select>
              <Option value="full_time">Full-time</Option>
              <Option value="part_time">Part-time</Option>
              <Option value="intern">Thực tập</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày vào làm" name="joined_date">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
         <Modal
        open={openAdd}
        title="Thêm nhân viên mới"
        onCancel={() => setOpenAdd(false)}
        okText="Thêm"
        onOk={handleAdd}
      >
        <Form layout="vertical" form={addForm}>
          <Form.Item label="Họ tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Chức vụ" name="position">
            <Input />
          </Form.Item>
          <Form.Item label="Lương" name="salary">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              addonAfter="₫"
              formatter={(value) => value ? `${Number(value).toLocaleString('vi-VN')}` : ''}
            />
          </Form.Item>
          <Form.Item label="Hình thức làm việc" name="working_type">
            <Select>
              <Option value="full_time">Full-time</Option>
              <Option value="part_time">Part-time</Option>
              <Option value="intern">Thực tập</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ngày vào làm" name="joined_date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffPage;
