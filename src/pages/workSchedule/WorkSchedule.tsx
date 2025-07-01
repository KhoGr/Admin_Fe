import { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Space, Typography, Tabs, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

import ScheduleStats from "../../components/workschedule/ScheduleStats";
import EmployeeSelector from "../../components/workschedule/EmployeeSelector";
import ScheduleTable from "../../components/workschedule/ScheduleTable";
import ScheduleDetailModal from "../../components/workschedule/ScheduleDetailModal";
import AddMonthlyShiftModal from "../../components/workschedule/AddMonthlyShiftModal";

import { WorkShift, CreateWorkShiftDto } from "../../types/workship";
import { StaffModel } from "../../types/staff";

import staffApi from "../../api/staffApi";
import workShiftApi from "../../api/workShiftApi";

const { Title } = Typography;

export default function WorkSchedulePage() {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [workShifts, setWorkShifts] = useState<WorkShift[]>([]);
  const [staffList, setStaffList] = useState<StaffModel[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(1);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [monthlyModalVisible, setMonthlyModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const params: any = {
        ...(selectedDate
          ? { date: selectedDate.format("YYYY-MM-DD") }
          : { month: selectedMonth.format("YYYY-MM") }),
        ...(selectedStaffId !== null ? { staffId: selectedStaffId } : {}),
      };

      const [staffs, shifts] = await Promise.all([
        staffApi.getAll(),
        workShiftApi.getAll(params),
      ]);
      setStaffList(staffs);
      setWorkShifts(shifts);
    } catch (err) {
      message.error("Failed to load data");
    }
  };

  useEffect(() => {
    if (!selectedDate) {
      fetchData(); // chỉ gọi khi chưa chọn ngày
    }
  }, [selectedMonth, selectedStaffId]);

  useEffect(() => {
    if (selectedDate) {
      fetchData(); // gọi khi có selectedDate
    }
  }, [selectedDate, selectedStaffId]);

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
    let result = workShifts;

    if (selectedDate) {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      result = result.filter((shift) => shift.date === dateStr);
    }

    return result;
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
            onChange={(date) => {
              setSelectedMonth(date ?? dayjs());
              setSelectedDate(null); // reset ngày nếu đổi tháng
            }}
          />
          <Button type="default" onClick={() => setMonthlyModalVisible(true)}>
            Add by Month
          </Button>
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
                <ScheduleStats shifts={filteredShifts} />

                <EmployeeSelector
                  employees={staffList}
                  selectedIds={selectedStaffId !== null ? [selectedStaffId] : []}
                  onChange={(ids) => {
                    setSelectedStaffId(ids.length > 0 ? ids[0] : null);
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

      <AddMonthlyShiftModal
        open={monthlyModalVisible}
        onClose={() => setMonthlyModalVisible(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
