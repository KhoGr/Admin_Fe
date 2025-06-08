import React from "react";
import {
  Modal,
  Form,
  Select,
  DatePicker,
  Button,
  message,
} from "antd";
import dayjs from "dayjs";
import { StaffModel } from "../../types/staff";
import { PayrollCreatePayload } from "../..//types/payroll";
import payrollApi from "../../api/payrollApi";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffList: StaffModel[];
}

const PayrollCreateModal: React.FC<Props> = ({
  open,
  onClose,
  onSuccess,
  staffList,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const selectedMonth = dayjs(values.month);
      const period_start = selectedMonth.startOf("month").format("YYYY-MM-DD");
      const period_end = selectedMonth.endOf("month").format("YYYY-MM-DD");

      const payload: PayrollCreatePayload = {
        staff_id: values.staff_id,
        period_start,
        period_end,
        status: values.status || "pending",
      };

      await payrollApi.create(payload);
      message.success("Tạo bảng lương thành công");
      onSuccess();
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Tạo bảng lương thất bại");
      console.error("❌ Tạo payroll thất bại:", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Tạo bảng lương"
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" onClick={handleSubmit}>
            Tạo
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="staff_id"
          label="Nhân viên"
          rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
        >
          <Select placeholder="Chọn nhân viên">
            {staffList.map((staff) => (
              <Option key={staff.staff_id} value={staff.staff_id}>
                {staff.user?.name || `NV ${staff.staff_id}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="month"
          label="Tháng"
          rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
        >
          <DatePicker picker="month" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          initialValue="pending"
        >
          <Select>
            <Option value="pending">Chờ thanh toán</Option>
            <Option value="paid">Đã thanh toán</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PayrollCreateModal;
