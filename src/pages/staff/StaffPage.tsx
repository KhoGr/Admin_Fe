import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, useTheme } from '@mui/material';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import StaffTable from '../../components/staff/staffTable';
import { StaffModel } from '../../types/staff';
import staffApi from '../../api/staffApi';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/slices/message.slice';

const { Option } = Select;

const StaffPage: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [form] = Form.useForm();

  const [staffs, setStaffs] = useState<StaffModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffModel | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const fetchAllStaffs = async () => {
    try {
      const data = await staffApi.getAll();
      console.log('Fetched staff data:', data);

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
      joined_date: staff.joined_date?.slice(0, 10),
      note: staff.note || '',
    });
    setOpenDetail(true);
  };

  useEffect(() => {
    fetchAllStaffs();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Danh sách nhân viên
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Tìm kiếm theo tên"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outlined" onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button variant="contained" color="primary" onClick={handleReload}>
          Tải lại
        </Button>
      </Box>

      <StaffTable staffList={staffs} onDetail={handleDetail} onReload={handleReload} />

      <Modal
        open={openDetail}
        title="Thông tin nhân viên"
        onCancel={() => setOpenDetail(false)}
        okText="Lưu"
        onOk={async () => {
          try {
            const values = await form.validateFields();
            if (!selectedStaff?.user?.user_id) {
              dispatch(setMessage({ message: 'Không có ID người dùng!', type: 'error' }));
              return;
            }

            await staffApi.update(selectedStaff.user.user_id, values);
            dispatch(setMessage({ message: 'Cập nhật nhân viên thành công!', type: 'success' }));
            setOpenDetail(false);
            fetchAllStaffs();
          } catch (error) {
            dispatch(setMessage({ message: 'Lỗi khi cập nhật nhân viên', type: 'error' }));
            console.error('Update error:', error);
          }
        }}
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
              formatter={(value: string | number | undefined): string =>
                value ? `${Number(value).toLocaleString('vi-VN')}` : ''
              }
              parser={(value: string | undefined): number =>
                value ? parseInt(value.replace(/[₫,.]/g, '')) : 0
              }
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
    </Container>
  );
};

export default StaffPage;
