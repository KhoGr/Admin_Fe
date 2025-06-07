import React from "react";
import { Table, Tag, Spin, Typography, Space, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Attendance } from "../../types/attendance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // ✅ Sử dụng UTC để giữ nguyên giờ quốc tế
dayjs.extend(utc);

const { Text } = Typography;

interface AttendanceTableProps {
  data: Attendance[];
  loading?: boolean;
  onEdit?: (attendance: Attendance) => void;
  onDelete?: (attendance: Attendance) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<Attendance> = [
    {
      title: "Nhân viên",
      dataIndex: ["staff", "user", "name"],
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Chức vụ",
      dataIndex: ["staff", "position"],
      key: "position",
    },
    {
      title: "Ngày làm",
      dataIndex: ["work_shift", "date"],
      key: "date",
    },
    {
      title: "Ca làm",
      dataIndex: ["work_shift", "shift_type"],
      key: "shift_type",
      render: (shift: string) => {
        const map: Record<string, string> = {
          morning: "Sáng",
          afternoon: "Chiều",
          evening: "Tối",
          full_day: "Cả ngày",
        };
        return map[shift] || shift;
      },
    },
    {
      title: "Check-in",
      dataIndex: "check_in_time",
      key: "check_in_time",
      render: (value) =>
        value ? dayjs.utc(value).format("HH:mm") : "-",
    },
    {
      title: "Check-out",
      dataIndex: "check_out_time",
      key: "check_out_time",
      render: (value) =>
        value ? dayjs.utc(value).format("HH:mm") : "-",
    },
    {
      title: "Giờ làm",
      dataIndex: "hours_worked",
      key: "hours_worked",
      render: (value) => (value ?? 0).toFixed(2) + "h",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: "present" | "late" | "absent" | "on_leave") => {
        const colorMap: Record<typeof status, string> = {
          present: "green",
          late: "orange",
          absent: "red",
          on_leave: "blue",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit?.(record)}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xoá bản ghi này?"
            onConfirm={() => onDelete?.(record)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button type="link" danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        dataSource={data}
        rowKey="attendance_id"
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </Spin>
  );
};

export default AttendanceTable;
