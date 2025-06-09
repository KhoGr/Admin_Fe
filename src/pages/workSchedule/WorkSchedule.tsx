import { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Space, Typography, Tabs, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

import ScheduleStats from "../../components/workschedule/ScheduleStats";
import EmployeeSelector from "../../components/workschedule/EmployeeSelector";
import ScheduleTable from "../../components/workschedule/ScheduleTable";
import ScheduleDetailModal from "../../components/workschedule/ScheduleDetailModal";
import EmployeeCalendar from "../../components/workschedule/EmployeeCalendar";

import { WorkShift, CreateWorkShiftDto } from "../../types/workship";
import { StaffModel } from "../../types/staff";

import staffApi from "../../api/staffApi";
import workShiftApi from "../../api/workShiftApi";

const { Title } = Typography;

export default function WorkSchedulePage() {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [workShifts, setWorkShifts] = useState<WorkShift[]>([]);
  const [staffList, setStaffList] = useState<StaffModel[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // 👈 thêm state ngày lọc

  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const [staffs, shifts] = await Promise.all([
        staffApi.getAll(),
        workShiftApi.getAll({
          month: selectedMonth.format("YYYY-MM"),
          staffId: selectedStaffId ?? undefined,
        }),
      ]);
      setStaffList(staffs);
      setWorkShifts(shifts);
    } catch (err) {
      message.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedStaffId]);

  const handleCreate = async (data: CreateWorkShiftDto) => {
    return await workShiftApi.create(data);
  };

  const handleUpdate = async (data: CreateWorkShiftDto) => {
    if (!editingShift) return;
    return await workShiftApi.update(editingShift.work_shift_id, data);
  };

  const handleDelete = async (id: number) => {
    try {
      await workShiftApi.delete(id);
      message.success("Deleted shift");
      fetchData();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const filteredShifts = useMemo(() => {
    if (!selectedDate) return workShifts;
    const dateStr = selectedDate.format("YYYY-MM-DD");
    return workShifts.filter((shift) => shift.date === dateStr);
  }, [workShifts, selectedDate]);

  return (
    <div>
      <Space
        style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}
      >
        <Title level={3}>Work Schedule</Title>
        <Space>
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={(date) => date && setSelectedMonth(date)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingShift(null);
              setModalVisible(true);
            }}
          >
            Add
          </Button>
        </Space>
      </Space>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Work Shifts",
            children: (
              <>
                <ScheduleStats shifts={workShifts} />

                <EmployeeSelector
                  employees={staffList}
                  selectedIds={selectedStaffId ? [selectedStaffId] : []}
                  onChange={(ids) => {
                    setSelectedStaffId(ids[0] ?? null);
                  }}
                  onDateChange={setSelectedDate} 
                  mode="single"
                  workshifts={workShifts}
                />

                <ScheduleTable
                  shifts={filteredShifts} 
                  onView={(shift) => {
                    setEditingShift(shift);
                    setModalVisible(true);
                  }}
                  onDelete={handleDelete}
                />
              </>
            ),
          },
          // {
          //   key: "2",
          //   label: "Calendar View",
          //   children: (
          //     <EmployeeCalendar
          //       currentDate={selectedMonth.toDate()}
          //       employees={staffList}
          //       workShifts={workShifts}
          //       onClickCell={(shift, employee, date) => {
          //         setEditingShift(shift ?? null);
          //         setModalVisible(true);
          //       }}
          //     />
          //   ),
          // },
        ]}
      />

      <ScheduleDetailModal
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingShift(null);
        }}
        onSubmit={editingShift ? handleUpdate : handleCreate}
        shiftData={editingShift}
        employees={staffList}
      />
    </div>
  );
}
