import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

import PayrollTable from '../../components/payroll/payrollTable';
import PayrollCreateModal from '../../components/payroll/PayrollCreateModal';

import payrollApi from '../../api/payrollApi';
import staffApi from '../../api/staffApi';

import { Payroll } from '../../types/payroll';
import { StaffModel } from '../../types/staff';

const PayrollPage: React.FC = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [staffList, setStaffList] = useState<StaffModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [payrollRes, staffRes] = await Promise.all([payrollApi.getAll(), staffApi.getAll()]);



      // In thử tên nhân viên từ payrolls (nếu có)
      payrollRes.forEach((p, idx) => {
        console.log(`🧾 Payroll #${idx + 1}:`, p);
console.log(`🧾 -> staff:`, p.staff);
console.log(`🧾 -> user:`, p.staff?.user);
console.log(`🧾 -> staff name =`, p.staff?.user?.name);

        const name = p?.staff?.user?.name;
        console.log(`🧾 Payroll #${idx + 1}: staff name = ${name}`);
      });

      setPayrolls(payrollRes);
      setStaffList(staffRes);
    } catch (error) {
      message.error('Không thể tải dữ liệu bảng lương');
      console.error('❌ Lỗi fetch payrolls:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <Card
        title="Quản lý bảng lương"
        extra={
          <div className="flex gap-2">
            <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
              Làm mới
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Tạo bảng lương
            </Button>
          </div>
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
