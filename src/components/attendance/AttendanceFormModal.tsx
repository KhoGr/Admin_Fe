import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import { Attendance, AttendanceCreatePayload } from "../../types/attendance";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: AttendanceCreatePayload) => void;
  initialData?: Attendance | null;
};

const AttendanceFormModal: React.FC<Props> = ({
  open,
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        check_in_time: initialData.check_in_time
          ? dayjs(initialData.check_in_time)
          : undefined,
        check_out_time: initialData.check_out_time
          ? dayjs(initialData.check_out_time)
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues: AttendanceCreatePayload = {
        ...values,
        check_in_time: values.check_in_time
          ? dayjs(values.check_in_time).add(0, "hour").format("YYYY-MM-DD HH:mm:ss")
          : null,
        check_out_time: values.check_out_time
          ? dayjs(values.check_out_time).add(0, "hour").format("YYYY-MM-DD HH:mm:ss")
          : null,
      };
      onSubmit(formattedValues);
    });
  };

  return (
    <Modal
      title={initialData ? "Chỉnh sửa điểm danh" : "Tạo mới điểm danh"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="staff_id"
          label="Mã nhân viên"
          rules={[{ required: true, message: "Vui lòng nhập mã nhân viên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="work_shift_id"
          label="Mã ca làm"
          rules={[{ required: true, message: "Vui lòng nhập mã ca làm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="check_in_time" label="Giờ vào">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="check_out_time" label="Giờ ra">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
          />
        </Form.Item>

        {initialData?.status && (
          <Form.Item label="Trạng thái">
            <Input value={initialData.status} disabled />
          </Form.Item>
        )}

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceFormModal;
