import React from "react";
import { Card } from "antd";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { WorkShift } from "../../types/workship";
import { StaffModel } from "../../types/staff";

type Props = {
  currentDate: Date;
  employees: StaffModel[];
  workShifts: WorkShift[];
  onClickCell?: (shift: WorkShift | null, employee: StaffModel, date: Date) => void;
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EmployeeCalendar: React.FC<Props> = ({
  currentDate,
  employees,
  workShifts,
  onClickCell,
}) => {
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getShiftFor = (staffId: number, date: Date) => {
    return workShifts.find(
      (shift) =>
        shift.staff_id === staffId &&
        format(new Date(shift.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <Card title="Lịch làm việc theo nhân viên" className="overflow-auto">
      <div className="min-w-[1000px]">
        {/* Header row - days of month */}
        <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(80px,1fr))] bg-gray-100 sticky top-0 z-10">
          <div className="p-2 font-semibold text-center bg-white border-r">Nhân viên</div>
          {daysInMonth.map((day) => (
            <div
              key={day.toISOString()}
              className={`p-2 text-center border-r border-b font-medium ${
                isToday(day)
                  ? "bg-blue-50 text-blue-600 border-blue-300"
                  : ""
              }`}
            >
              {format(day, "dd")}
              <br />
              <span className="text-xs text-gray-400">
                {dayLabels[day.getDay()]}
              </span>
            </div>
          ))}
        </div>

        {/* Rows per employee */}
        {employees.map((employee) => (
          <div
            key={employee.staff_id}
            className="grid grid-cols-[200px_repeat(auto-fill,minmax(80px,1fr))] border-b"
          >
            {/* Employee name */}
            <div className="p-2 font-medium border-r whitespace-nowrap overflow-hidden text-ellipsis">
              {employee.user?.name}
            </div>

            {/* Work shifts per day */}
            {daysInMonth.map((day) => {
              const shift = getShiftFor(employee.staff_id, day);
              const cellClass = `p-1 text-center text-sm cursor-pointer border-r hover:bg-gray-50 ${
                shift
                  ? "bg-green-50 text-green-600 border-green-300"
                  : "text-gray-400"
              }`;
              return (
                <div
                  key={day.toISOString()}
                  className={cellClass}
                  onClick={() => onClickCell?.(shift ?? null, employee, day)}
                >
                  {shift ? `${shift.start_time} - ${shift.end_time}` : "-"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EmployeeCalendar;
