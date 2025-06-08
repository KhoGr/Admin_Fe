import React, { useState, useMemo } from "react";
import { Table, Tag, Button, Space, DatePicker, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Payroll } from "../../types/payroll";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import payrollApi from "../../api/payrollApi";

dayjs.extend(isBetween);

const { Option } = Select;

const statusColors: Record<string, string> = {
  paid: "green",
  pending: "orange",
};

interface PayrollTableProps {
  data: Payroll[];
  loading: boolean;
  onReload: () => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ data, loading, onReload }) => {
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number | undefined>();

  const handleMarkAsPaid = async (record: Payroll) => {
    try {
      await payrollApi.updateStatus(record.payroll_id, { status: "paid" });
      message.success("Cập nhật trạng thái thành công!");
      onReload();
    } catch (err) {
      console.error("Failed to update payroll status:", err);
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  // Get unique staff options from data
  const staffOptions = useMemo(() => {
    const map = new Map<number, string>();
    data.forEach((p) => {
      if (p.staff?.staff_id && p.staff?.user?.name) {
        map.set(p.staff.staff_id, p.staff.user.name);
      }
    });
    return Array.from(map.entries());
  }, [data]);

  const filteredData = data.filter((record) => {
    let pass = true;

    if (selectedStatus) {
      pass = pass && record.status === selectedStatus;
    }

    if (selectedStaffId) {
      pass = pass && record.staff?.staff_id === selectedStaffId;
    }

    if (selectedMonth) {
      const start = selectedMonth.startOf("month");
      const end = selectedMonth.endOf("month");
      const periodStart = dayjs(record.period_start);
      pass = pass && periodStart.isBetween(start, end, "day", "[]");
    }

    return pass;
  });

  const columns: ColumnsType<Payroll> = [
    {
      title: "Nhân viên",
      dataIndex: ["staff", "user", "name"],
      key: "staff_name",
    },
    {
      title: "Từ ngày",
      dataIndex: "period_start",
      key: "period_start",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Đến ngày",
      dataIndex: "period_end",
      key: "period_end",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Tổng giờ",
      dataIndex: "total_hours",
      key: "total_hours",
    },
    {
      title: "Tổng lương (VNĐ)",
      dataIndex: "total_salary",
      key: "total_salary",
      render: (salary) => Number(salary).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={statusColors[status] || "default"}>
          {status === "paid" ? "Đã trả" : "Chờ xử lý"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* <Button size="small" onClick={() => console.log("Xem", record)}>
            Xem
          </Button> */}
          <Button
            size="small"
            type="primary"
            disabled={record.status === "paid"}
            onClick={() => handleMarkAsPaid(record)}
          >
            Đánh dấu đã trả
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <DatePicker
          picker="month"
          onChange={(date) => setSelectedMonth(date)}
          placeholder="Chọn tháng"
          className="w-[180px]"
        />

        <Select
          placeholder="Nhân viên"
          style={{ width: 200 }}
          allowClear
          value={selectedStaffId}
          onChange={(val) => setSelectedStaffId(val)}
        >
          {staffOptions.map(([id, name]) => (
            <Option key={id} value={id}>
              {name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Trạng thái"
          style={{ width: 160 }}
          allowClear
          value={selectedStatus}
          onChange={(val) => setSelectedStatus(val)}
        >
          <Option value="pending">Chờ xử lý</Option>
          <Option value="paid">Đã trả</Option>
        </Select>

        <Button type="primary" onClick={onReload}>
          Làm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="payroll_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PayrollTable;
