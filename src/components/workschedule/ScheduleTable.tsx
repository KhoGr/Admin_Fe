import React from "react";
import { Table, Space, Button, Popconfirm, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { WorkShift } from "../../types/workship";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

type Props = {
  shifts: WorkShift[];
  onView: (shift: WorkShift) => void;
  onDelete: (shiftId: number) => void;
};

const ScheduleTable: React.FC<Props> = ({ shifts, onView, onDelete }) => {
  const columns: ColumnsType<WorkShift> = [
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
      render: (staff) => staff?.user?.name || "N/A",
    },
    {
      title: "Ngày làm",
      dataIndex: "work_date",
      key: "work_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giờ làm",
      key: "hours",
      render: (_, record) =>
        `${record.start_time?.slice(0, 5)} - ${record.end_time?.slice(0, 5)}`,
    },
    {
      title: "Số giờ",
      key: "duration",
      render: (_, record) => {
        const start = dayjs(record.start_time, "HH:mm:ss");
        const end = dayjs(record.end_time, "HH:mm:ss");
        const type = record.staff?.working_type;

        if (!start.isValid() || !end.isValid()) return "-";

        const duration = end.diff(start, "minute") / 60;
        return type === "parttime"
          ? `${duration.toFixed(1)} giờ`
          : "1 ngày";
      },
    },
    {
      title: "Tiền công dự tính",
      key: "salary",
      render: (_, record) => {
        const start = dayjs(record.start_time, "HH:mm:ss");
        const end = dayjs(record.end_time, "HH:mm:ss");
        const staff = record.staff;
        const type = staff?.working_type;
        const salary = Number(staff?.salary);

        if (!start.isValid() || !end.isValid() || isNaN(salary)) return "-";

        if (type === "parttime") {
          const duration = end.diff(start, "minute") / 60;
          const total = duration * salary;
          return `${total.toLocaleString("vi-VN")} ₫`;
        } else {
          return `${salary.toLocaleString("vi-VN")} ₫`;
        }
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => (text ? <Tag color="blue">{text}</Tag> : "-"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => onView(record)}
          >
            Xem
          </Button>
          <Popconfirm
            title="Xác nhận xoá ca làm này?"
            onConfirm={() => onDelete(record.work_shift_id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={shifts}
      rowKey="work_shift_id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default ScheduleTable;
