import React from "react";
import { Select } from "antd";
import { StaffModel } from "../../types/staff";

const { Option } = Select;

type Props = {
  employees: StaffModel[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  mode?: "multiple" | "single";
  placeholder?: string;
};

const EmployeeSelector: React.FC<Props> = ({
  employees,
  selectedIds,
  onChange,
  mode = "multiple",
  placeholder = "Chọn nhân viên",
}) => {
  return (
    <Select
      mode={mode === "multiple" ? "multiple" : undefined}
      allowClear
      placeholder={placeholder}
      style={{ width: "100%" }}
      value={selectedIds}
      onChange={(value) => onChange(value)}
      optionFilterProp="children"
      showSearch
    >
      {employees.map((employee) => (
        <Option key={employee.staff_id} value={employee.staff_id}>
          {employee.user?.name || "Chưa có tên"}
        </Option>
      ))}
    </Select>
  );
};

export default EmployeeSelector;
