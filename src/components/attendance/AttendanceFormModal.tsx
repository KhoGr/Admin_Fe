import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Attendance, AttendanceCreatePayload } from "../../types/attendance";
import { StaffModel } from "../../types/staff";
import { WorkShift } from "../../types/workship";
import staffApi from "../../api/staffApi";
import workShiftApi from "../../api/workShiftApi";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  const [staffs, setStaffs] = useState<StaffModel[]>([]);
  const [workShifts, setWorkShifts] = useState<WorkShift[]>([]);

  useEffect(() => {
    if (open) {
      staffApi.getAll().then(setStaffs).catch(() => {
        message.error("Không thể tải danh sách nhân viên");
      });

      if (initialData?.staff_id) {
        workShiftApi
          .getAll({ staffId: initialData.staff_id })
          .then(setWorkShifts)
          .catch(() => message.error("Không thể tải ca làm"));
      }
    }
  }, [open]);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        check_in_time: initialData.check_in_time
          ? dayjs.utc(initialData.check_in_time)
          : undefined,
        check_out_time: initialData.check_out_time
          ? dayjs.utc(initialData.check_out_time)
          : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleStaffChange = (staffId: number) => {
    form.setFieldValue("work_shift_id", undefined); // reset shift
    workShiftApi
      .getAll({ staffId })
      .then(setWorkShifts)
      .catch(() => message.error("Không thể tải ca làm của nhân viên này"));
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const formattedValues: AttendanceCreatePayload = {
        ...values,
        check_in_time: values.check_in_time
          ? dayjs(values.check_in_time).format("YYYY-MM-DD HH:mm:ss")
          : null,
        check_out_time: values.check_out_time
          ? dayjs(values.check_out_time).format("YYYY-MM-DD HH:mm:ss")
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
          label="Nhân viên"
          rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
        >
          <Select
            showSearch
            placeholder="Chọn nhân viên"
            onChange={handleStaffChange}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children?.toString() || "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {staffs.map((staff) => (
              <Select.Option key={staff.staff_id} value={staff.staff_id}>
                {staff.user?.name} ({staff.position})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="work_shift_id"
          label="Ca làm"
          rules={[{ required: true, message: "Vui lòng chọn ca làm" }]}
        >
          <Select placeholder="Chọn ca làm" optionLabelProp="label">
            {workShifts.map((shift) => {
              const label = `${shift.date} - ${shift.shift_type.toUpperCase()} (${shift.start_time} ~ ${shift.end_time})`;
              return (
                <Select.Option
                  key={shift.work_shift_id}
                  value={shift.work_shift_id}
                  label={label}
                >
                  {label}
                </Select.Option>
              );
            })}
          </Select>
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
