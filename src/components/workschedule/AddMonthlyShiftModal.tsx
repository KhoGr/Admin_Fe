import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Button,
} from "antd";
import dayjs from "dayjs";
import staffApi from "../../api/staffApi";
import workShiftApi from "../../api/workShiftApi";
import { StaffModel } from "../../types/staff";

const { Option } = Select;

interface AddMonthlyShiftModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddMonthlyShiftModal: React.FC<AddMonthlyShiftModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [staffList, setStaffList] = useState<StaffModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      staffApi
        .getAll()
        .then(setStaffList)
        .catch(() => message.error("Lỗi khi tải danh sách nhân viên"));
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const staff_id = values.staff_id;
      const month = dayjs(values.month).format("YYYY-MM");

      setLoading(true);
      const res = await workShiftApi.generateMonthly({ staff_id, month });
      message.success(`Tạo thành công: ${res.created} ca, bỏ qua ${res.skipped}`);
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error: any) {
      message.error(error?.message || "Lỗi khi tạo ca làm việc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo ca làm việc theo tháng"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Tạo ca
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Nhân viên"
          name="staff_id"
          rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
        >
          <Select
            showSearch
            placeholder="Chọn nhân viên"
            optionFilterProp="children"
            filterOption={(input, option) =>
              typeof option?.children === "string"
                ? (option.children as string).toLowerCase().includes(input.toLowerCase())
                : false
            }
          >
            {staffList.map((staff) => (
              <Option key={staff.staff_id} value={staff.staff_id}>
                {staff.user?.name || `Staff ${staff.staff_id}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tháng"
          name="month"
          rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
        >
          <DatePicker picker="month" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMonthlyShiftModal;
