import React, { useMemo, useState } from "react";
import { Select, DatePicker, Space, Input } from "antd";
import { UserOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { StaffModel } from "../../types/staff";
import { WorkShift } from "../../types/workship";

type Props = {
  employees: StaffModel[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  mode?: "multiple" | "single";
  placeholder?: string;
  workshifts?: WorkShift[];
  onDateChange?: (date: Dayjs | null) => void;
};

const EmployeeSelector: React.FC<Props> = ({
  employees,
  selectedIds,
  onChange,
  mode = "multiple",
  placeholder = "Chọn nhân viên",
  workshifts = [],
  onDateChange,
}) => {
  const isMultiple = mode === "multiple";
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const filteredEmployees = useMemo(() => {
    if (!selectedDate) return employees;

    const dateStr = selectedDate.format("YYYY-MM-DD");
    const staffIdsOnDate = new Set(
      workshifts
        .filter((shift) => shift.date === dateStr)
        .map((shift) => shift.staff_id)
    );

    return employees.filter((emp) => staffIdsOnDate.has(emp.staff_id));
  }, [employees, workshifts, selectedDate]);

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    onDateChange?.(date);
  };

  return (
    <Space style={{ width: "100%" }} size="middle">
      <DatePicker
        placeholder="Lọc theo ngày"
        style={{ flex: 1 }}
        allowClear
        value={selectedDate}
        onChange={handleDateChange}
        suffixIcon={<CalendarOutlined />}
      />
      <Select
        mode={isMultiple ? "multiple" : undefined}
        allowClear
        showSearch
        placeholder={placeholder}
        style={{ flex: 2 }}
        value={isMultiple ? selectedIds : selectedIds[0] ?? undefined}
        onChange={(value) =>
          isMultiple
            ? onChange(value as number[])
            : onChange(value !== undefined ? [value as number] : [])
        }
        filterOption={(input, option) =>
          typeof option?.children === "string" &&
          (option.children as string).toLowerCase().includes(input.toLowerCase())
        }
        suffixIcon={<UserOutlined />}
      >
        {filteredEmployees.map((staff) => (
          <Select.Option key={staff.staff_id} value={staff.staff_id}>
            {staff.user?.name || "Không tên"}
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
};

export default EmployeeSelector;
