import React, { useEffect, useState } from 'react';
import { Button, Card, DatePicker, Flex, message } from 'antd';
import { PlusOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

import PayrollTable from '../../components/payroll/payrollTable';
import PayrollCreateModal from '../../components/payroll/PayrollCreateModal';

import payrollApi from '../../api/payrollApi';
import staffApi from '../../api/staffApi';

import { Payroll } from '../../types/payroll';
import { StaffModel } from '../../types/staff';

const getPeriodRange = (month: string) => {
  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return {
    period_start: start.toISOString().split('T')[0],
    period_end: end.toISOString().split('T')[0],
  };
};

const PayrollPage: React.FC = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [staffList, setStaffList] = useState<StaffModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payrollRes, staffRes] = await Promise.all([
        payrollApi.getAll(),
        staffApi.getAll(),
      ]);
      setPayrolls(payrollRes);
      setStaffList(staffRes);
    } catch (error) {
      message.error('Không thể tải dữ liệu bảng lương');
      console.error('❌ Lỗi fetch payrolls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    const month = selectedMonth.format('YYYY-MM');
    const { period_start, period_end } = getPeriodRange(month);
    const staff_ids = staffList.map((s) => s.staff_id);

    try {
      setLoading(true);
      const result = await payrollApi.generateAll({
        period_start,
        period_end,
        staff_ids,
      });
      message.success(`✅ Đã tạo ${result.length} bảng lương cho tháng ${month}`);
      fetchData();
    } catch (error) {
      console.error('❌ Lỗi khi tạo lương hàng loạt:', error);
      message.error('Tạo bảng lương hàng loạt thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Khu vực tạo lương theo tháng */}
      <Card title="Tạo bảng lương theo tháng">
        <Flex gap="middle" align="center" wrap="wrap">
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={(val) => val && setSelectedMonth(val)}
            format="YYYY-MM"
            allowClear={false}
          />
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={handleGenerateAll}
            loading={loading}
          >
            Tạo bảng lương tháng {selectedMonth.format('MM/YYYY')}
          </Button>
        </Flex>
      </Card>

      {/* Khu vực quản lý bảng lương */}
      <Card
        title="Quản lý bảng lương"
        extra={
          <Flex gap="small">
            <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
              Làm mới
            </Button>
            <Button icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Tạo thủ công
            </Button>
          </Flex>
        }
      >
        <PayrollTable data={payrolls} loading={loading} onReload={fetchData} />
      </Card>

      <PayrollCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        staffList={staffList}
      />
    </div>
  );
};

export default PayrollPage;
