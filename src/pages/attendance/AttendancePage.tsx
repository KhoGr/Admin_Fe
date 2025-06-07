import React, { useState, useEffect } from "react";
import { Button, Input, DatePicker, Row, Col, Space, message } from "antd";
import dayjs from "dayjs";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceFormModal from "../../components/attendance/AttendanceFormModal";
import attendanceApi from "../../api/attendanceApi";
import { Attendance, AttendanceCreatePayload } from "../../types/attendance";

const AttendancePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Attendance | null>(null);
  const [searchStaffId, setSearchStaffId] = useState("");
  const [searchDate, setSearchDate] = useState<string | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const fetchData = async () => {
    try {
      const data = await attendanceApi.getAll();
      setAttendances(data);
    } catch {
      message.error("Không thể tải danh sách");
    }
  };

  const handleSearch = async () => {
    try {
      const data = await attendanceApi.filter({
        staffId: searchStaffId ? Number(searchStaffId) : undefined,
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
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý điểm danh</h2>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Input
            placeholder="Tìm theo Staff ID"
            value={searchStaffId}
            onChange={(e) => setSearchStaffId(e.target.value)}
          />
        </Col>
        <Col>
          <DatePicker
            placeholder="Chọn ngày"
            onChange={(date) => setSearchDate(date ? date.format("YYYY-MM-DD") : null)}
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
