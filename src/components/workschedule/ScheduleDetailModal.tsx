import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { CreateWorkShiftDto, ShiftType, WorkShift } from "../../types/workship";
import { StaffModel } from "../../types/staff";

const { TextArea } = Input;
const { Paragraph } = Typography;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWorkShiftDto) => Promise<any>;
  shiftData?: WorkShift | null;
  employees: StaffModel[];
};

const shiftOptions: { label: string; value: ShiftType }[] = [
  { label: "Sáng", value: "morning" },
  { label: "Chiều", value: "afternoon" },
  { label: "Tối", value: "evening" },
  { label: "Cả ngày", value: "full_day" },
];

const shiftTimeDefaults: Record<ShiftType, { start: string; end: string }> = {
  morning: { start: "08:00:00", end: "12:00:00" },
  afternoon: { start: "13:00:00", end: "18:00:00" },
  evening: { start: "18:00:00", end: "21:00:00" },
  full_day: { start: "08:00:00", end: "21:00:00" },
};

const ScheduleDetailModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  shiftData,
  employees,
}) => {
  const [form] = Form.useForm();
  const [selectedShiftTypes, setSelectedShiftTypes] = useState<ShiftType[]>([]);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  useEffect(() => {
    if (shiftData) {
      setSelectedShiftTypes([shiftData.shift_type]);
      form.setFieldsValue({
        ...shiftData,
        date: dayjs(shiftData.date),
        shift_type: [shiftData.shift_type],
      });
    } else {
      form.resetFields();
      setSelectedShiftTypes([]);
    }
  }, [shiftData, form]);

  const handleShiftTypeChange = (values: ShiftType[]) => {
    setSelectedShiftTypes(values);
  };

const handleOk = async () => {
  try {
    const values = await form.validateFields();

    const shiftTypes: ShiftType[] = values.shift_type;
    const payloads: CreateWorkShiftDto[] = shiftTypes.map((type) => {
      const times = shiftTimeDefaults[type];
      return {
        staff_id: values.staff_id,
        date: values.date.format("YYYY-MM-DD"),
        shift_type: type,
        start_time: times.start,
        end_time: times.end,
        note: values.note,
      };
    });

    const errorMessages: string[] = [];

    for (const payload of payloads) {
      try {
        await onSubmit(payload);
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ||
          err?.message ||
          "Lỗi không xác định";
        errorMessages.push(
          `Ca ${payload.shift_type.toUpperCase()}: ${msg}`
        );
      }
    }

    if (errorMessages.length > 0) {
      // Có lỗi: hiện modal lỗi, KHÔNG đóng modal form
      setErrorList(errorMessages);
      setErrorModalOpen(true);
    } else {
      // Thành công: reset form và đóng modal
      form.resetFields();
      setSelectedShiftTypes([]);
      onClose();
      message.success(shiftData ? "Cập nhật thành công" : "Tạo ca làm thành công");
    }
  } catch (err) {
  }
};


  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          onClose();
          form.resetFields();
          setSelectedShiftTypes([]);
        }}
        onOk={handleOk}
        title={shiftData ? "Chỉnh sửa ca làm" : "Thêm ca làm mới"}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="staff_id"
            label="Nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
          >
            <Select placeholder="Chọn nhân viên">
              {employees.map((staff) => (
                <Select.Option key={staff.staff_id} value={staff.staff_id}>
                  {staff.user?.name || `Mã NV: ${staff.staff_id}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày làm việc"
            rules={[{ required: true, message: "Vui lòng chọn ngày làm" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="shift_type"
            label="Loại ca"
            rules={[{ required: true, message: "Chọn ít nhất một loại ca" }]}
          >
            <Select
              mode="multiple"
              options={shiftOptions}
              onChange={handleShiftTypeChange}
              placeholder="Chọn 1 hoặc nhiều ca làm"
            />
          </Form.Item>

          <Form.Item label="Thời gian gợi ý (hiển thị)">
            <Input
              disabled
              value={
                selectedShiftTypes.length === 1
                  ? `${shiftTimeDefaults[selectedShiftTypes[0]].start} - ${shiftTimeDefaults[selectedShiftTypes[0]].end}`
                  : "Chọn 1 loại ca để hiển thị giờ"
              }
            />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal hiển thị lỗi nếu có */}
      <Modal
        open={errorModalOpen}
        onCancel={() => setErrorModalOpen(false)}
        onOk={() => setErrorModalOpen(false)}
        title="Lỗi khi tạo ca làm"
        okText="Đóng"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        {errorList.map((err, idx) => (
          <Paragraph key={idx} type="danger">
            {err}
          </Paragraph>
        ))}
      </Modal>
    </>
  );
};

export default ScheduleDetailModal;
