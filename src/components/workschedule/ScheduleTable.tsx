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
      render: (staff) => staff?.user?.full_name || "N/A",
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
      render: (_, record) => `${record.start_time}h - ${record.end_time}h`,
    },
    {
      title: "Số giờ",
      key: "duration",
      render: (_, record) => Number(record.end_time) - Number(record.start_time),
    },
    {
      title: "Tiền công",
      key: "salary",
    //   render: (_, record) =>
    //     ((Number(record.end_time) - Number(record.start_time)) * Number(record.hourly_rate)).toLocaleString() + " ₫",
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
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default ScheduleTable;
