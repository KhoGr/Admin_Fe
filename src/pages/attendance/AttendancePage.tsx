import React, { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Row,
  Col,
  Space,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceFormModal from "../../components/attendance/AttendanceFormModal";
import attendanceApi from "../../api/attendanceApi";
import staffApi from "../../api/staffApi";
import { Attendance, AttendanceCreatePayload } from "../../types/attendance";
import { StaffModel } from "../../types/staff";

const AttendancePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Attendance | null>(null);
  const [searchStaffId, setSearchStaffId] = useState<number | null>(null);
  const [searchDate, setSearchDate] = useState<string | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffModel[]>([]);

  const fetchData = async () => {
    try {
      const data = await attendanceApi.getAll();
      setAttendances(data);
    } catch {
      message.error("Không thể tải danh sách");
    }
  };

  const fetchStaffs = async () => {
    try {
      const data = await staffApi.getAll();
      setStaffOptions(data);
    } catch {
      message.error("Không thể tải danh sách nhân viên");
    }
  };

  const handleSearch = async () => {
    try {
      const data = await attendanceApi.filter({
        staffId: searchStaffId ?? undefined,
        date: searchDate || undefined,
      });
      setAttendances(data);
    } catch {
      message.error("Lỗi khi tìm kiếm");
    }
  };

  const handleCreateOrUpdate = async (values: AttendanceCreatePayload) => {
    try {
      if (editRecord) {
        await attendanceApi.update(editRecord.attendance_id, values);
        message.success("Cập nhật thành công");
      } else {
        await attendanceApi.create(values);
        message.success("Tạo mới thành công");
      }
      setModalOpen(false);
      fetchData();
    } catch {
      message.error("Lỗi khi lưu dữ liệu");
    }
  };

  useEffect(() => {
    fetchData();
    fetchStaffs();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý điểm danh</h2>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Select
            showSearch
            allowClear
            placeholder="Chọn nhân viên"
            style={{ width: 250 }}
            optionFilterProp="label"
            value={searchStaffId ?? undefined}
            onChange={(value) => setSearchStaffId(value)}
            options={staffOptions.map((staff) => ({
              label: staff?.user?.name,
              value: staff.staff_id,
            }))}
          />
        </Col>
        <Col>
          <DatePicker
            placeholder="Chọn ngày"
            onChange={(date) =>
              setSearchDate(date ? date.format("YYYY-MM-DD") : null)
            }
          />
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
            <Button onClick={fetchData}>Tải lại</Button>
          </Space>
        </Col>
        <Col flex="auto" style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => {
              setEditRecord(null);
              setModalOpen(true);
            }}
          >
            Thêm điểm danh
          </Button>
        </Col>
      </Row>

      <AttendanceTable
        data={attendances}
        onEdit={(record) => {
          setEditRecord(record);
          setModalOpen(true);
        }}
        onDelete={async (record) => {
          try {
            await attendanceApi.delete(record.attendance_id);
            message.success("Xoá thành công");
            fetchData();
          } catch {
            message.error("Lỗi khi xoá");
          }
        }}
      />

      <AttendanceFormModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editRecord}
      />
    </div>
  );
};

export default AttendancePage;
