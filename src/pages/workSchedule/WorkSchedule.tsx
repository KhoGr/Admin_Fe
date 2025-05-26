import { useState } from 'react';
import {
  Button,
  Modal,
  Tabs,
  Card,
  DatePicker,
  Table,
  Avatar,
  message,
  Space,
  Row,
  Col,
  Typography,
  Statistic,
  Divider,
  Tooltip,
} from 'antd';
const { Text } = Typography;
const { TabPane } = Tabs;
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { WorkScheduleForm } from '../../components/workschedule/WorkScheduleTable';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';


interface WorkSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  hoursWorked: number;
  hourlyRate: number;
  totalPay: number;
  notes?: string;
}
// Define the Employee interface
interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  startDate: Date;
}

export const mockEmployees: Employee[] = [
    {
    id: "e1",
    name: "Robert Chen",
    position: "Head Chef",
    email: "robert.c@restaurant.com",
    phone: "555-111-2222",
    startDate: new Date(2020, 1, 10),
  },
  {
    id: "e2",
    name: "Lisa Wong",
    position: "Manager",
    email: "lisa.w@restaurant.com",
    phone: "555-222-3333",
    startDate: new Date(2020, 3, 15),
  },
  {
    id: "e3",
    name: "James Rodriguez",
    position: "Waiter",
    email: "james.r@restaurant.com",
    phone: "555-333-4444",
    startDate: new Date(2021, 5, 20),
  },
  {
    id: "e4",
    name: "Maria Garcia",
    position: "Bartender",
    email: "maria.g@restaurant.com",
    phone: "555-444-5555",
    startDate: new Date(2021, 8, 5),
  },
  {
    id: "e5",
    name: "Daniel Kim",
    position: "Sous Chef",
    email: "daniel.k@restaurant.com",
    phone: "555-555-6666",
    startDate: new Date(2022, 2, 12),
  },
];

export const mockWorkSchedules: WorkSchedule[] = [
    {
    id: "ws1",
    employeeId: "e1",
    employeeName: "Robert Chen",
    date: new Date(2024, 11, 1, 8, 0), // Morning shift
    hoursWorked: 8,
    hourlyRate: 25,
    totalPay: 200,
    notes: "Morning shift",
  },
  {
    id: "ws2",
    employeeId: "e1",
    employeeName: "Robert Chen",
    date: new Date(2024, 11, 3, 18, 0), // Evening shift
    hoursWorked: 9,
    hourlyRate: 25,
    totalPay: 225,
    notes: "Evening shift with 1 hour overtime",
  },
  {
    id: "ws3",
    employeeId: "e2",
    employeeName: "Lisa Wong",
    date: new Date(2024, 11, 1, 8, 0), // Morning shift
    hoursWorked: 8,
    hourlyRate: 30,
    totalPay: 240,
    notes: "Manager morning shift",
  },
];
const workSchedule = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WorkSchedule | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleEdit = (schedule: WorkSchedule) => {
    setEditingSchedule(schedule);
    setIsOpen(true);
  };
  const handleSave = (schedule: WorkSchedule) => {
    setIsOpen(false);
    setEditingSchedule(null);
    toast.success(
      `Work schedule for ${schedule.employeeName} has been ${
        editingSchedule ? 'updated' : 'added'
      }.`,
    );
  };
  const filteredSchedules = mockWorkSchedules
    .filter((schedule) => !selectedEmployeeId || schedule.employeeId === selectedEmployeeId)
    .filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return isSameMonth(scheduleDate, selectedMonth);
    });

  const totalHours = filteredSchedules.reduce((sum, s) => sum + s.hoursWorked, 0);
  const totalPay = filteredSchedules.reduce((sum, s) => sum + s.totalPay, 0);

  const columns: ColumnsType<WorkSchedule> = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (value: Date) => format(new Date(value), 'MMM dd, yyyy'),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Shift',
      key: 'shift',
      render: (_, record) => {
        const hour = new Date(record.date).getHours();
        return hour < 12 ? 'Morning' : 'Evening';
      },
    },
    {
      title: 'Hours',
      dataIndex: 'hoursWorked',
      key: 'hoursWorked',
    },
    {
      title: 'Rate',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
      render: (value: number) => <span>${value.toFixed(2)}</span>,
    },
    {
      title: 'Total Pay',
      dataIndex: 'totalPay',
      key: 'totalPay',
      render: (value: number) => <span>${value.toFixed(2)}</span>,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="text" size="small" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get schedule for a specific date
  const getScheduleForDate = (date: Date, employeeId: string) => {
    return mockWorkSchedules.find(
      (schedule) => schedule.employeeId === employeeId && isSameDay(new Date(schedule.date), date),
    );
  };
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Row justify="space-between" align="middle">
        <Col>
  <Typography.Title level={3}>Work Schedules</Typography.Title>
          <Typography.Text>Manage employee work schedules and earnings.</Typography.Text>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
            Add Work Shift
          </Button>
          <Modal
            title={editingSchedule ? 'Edit Work Schedule' : 'Add Work Schedule'}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null}
          >
            <WorkScheduleForm
              initialData={editingSchedule}
              onSave={handleSave}
              onCancel={() => setIsOpen(false)}
              preselectedEmployeeId={selectedEmployeeId || undefined}
            />
          </Modal>
        </Col>
      </Row>

      <Card title="Select Month">
        <Row justify="end">
<DatePicker
  picker="month"
  value={dayjs(selectedMonth)} // chuyển Date -> dayjs
  onChange={(date) => date && setSelectedMonth(date.toDate())} // chuyển dayjs -> Date
  allowClear={false}
/>

        </Row>
      </Card>

      <Tabs defaultActiveKey="all">
        <TabPane tab="All Schedules" key="all">
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Statistic title="Total Shifts" value={filteredSchedules.length} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Hours" value={totalHours.toFixed(1)} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Pay" prefix="$" value={totalPay.toFixed(2)} />
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredSchedules}
              rowKey="id"
              // searchKey and searchPlaceholder are not standard antd props, remove or implement custom search if needed
            />
          </Card>
        </TabPane>

        <TabPane tab="By Employee" key="by-employee">
          <Table columns={columns} dataSource={filteredSchedules} rowKey="id" pagination={false} />
          <Row gutter={16} style={{ marginTop: 16 }}>
            {mockEmployees.map((employee) => (
              <Col span={6} key={employee.id}>
                <Card
                  hoverable
                  onClick={() => setSelectedEmployeeId(employee.id)}
                  style={{
                    backgroundColor: selectedEmployeeId === employee.id ? '#e6f7ff' : undefined,
                    cursor: 'pointer',
                  }}
                >
                  <Space>
                    <Avatar>{employee.name.charAt(0)}</Avatar>
                    <div>
                      <Typography.Text strong>{employee.name}</Typography.Text>
                      <div>
                        <Typography.Text type="secondary">{employee.position}</Typography.Text>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {selectedEmployeeId && (
            <>
              <Divider />
              <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                  <Typography.Title level={4}>
                    Work Schedule for {mockEmployees.find((e) => e.id === selectedEmployeeId)?.name}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    Position: {mockEmployees.find((e) => e.id === selectedEmployeeId)?.position}
                  </Typography.Text>
                </Col>
                <Col>
                  <Button size="small" icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
                    Add Shift
                  </Button>
                </Col>
              </Row>

              <Card title="Monthly Calendar">
                <Row gutter={8} justify="center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Col span={3} key={day}>
                      <Text>{day}</Text>
                    </Col>
                  ))}
                  {calendarDays.map((day) => {
                    const schedule = getScheduleForDate(day, selectedEmployeeId);
                    const isToday = isSameDay(day, new Date());
                    const hasSchedule = !!schedule;

                    return (
                      <Col span={3} key={day.toString()}>
                        <Tooltip
                          title={hasSchedule ? `Hours: ${schedule.hoursWorked}` : 'No shift'}
                        >
                          <Card
                            size="small"
                            bordered
                            style={{
                              backgroundColor: isToday
                                ? '#bae7ff'
                                : hasSchedule
                                ? '#d9f7be'
                                : undefined,
                              cursor: hasSchedule ? 'pointer' : 'default',
                            }}
                            onClick={() => hasSchedule && setSelectedDate(day)}
                          >
                            <div style={{ textAlign: 'center' }}>{format(day, 'd')}</div>
                          </Card>
                        </Tooltip>
                      </Col>
                    );
                  })}
                </Row>
              </Card>

              {selectedDate && (
                <Modal
                  title={`Schedule Details - ${format(selectedDate, 'MMM dd, yyyy')}`}
                  open={!!selectedDate}
                  onCancel={() => setSelectedDate(null)}
                  footer={null}
                >
                  {(() => {
                    const daySchedule = getScheduleForDate(selectedDate, selectedEmployeeId);
                    if (!daySchedule) return <p>No schedule for this day.</p>;

                    const shiftType =
                      new Date(daySchedule.date).getHours() < 12 ? 'Morning' : 'Evening';

                    return (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <Text strong>Shift:</Text> {shiftType}
                          </Col>
                          <Col span={12}>
                            <Text strong>Hours:</Text> {daySchedule.hoursWorked}
                          </Col>
                          <Col span={12}>
                            <Text strong>Hourly Rate:</Text> ${daySchedule.hourlyRate.toFixed(2)}
                          </Col>
                          <Col span={12}>
                            <Text strong>Total Pay:</Text> ${daySchedule.totalPay}
                          </Col>
                        </Row>
                        {daySchedule.notes && (
                          <div>
                            <Text strong>Notes:</Text>
                            <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: 4 }}>
                              {daySchedule.notes}
                            </div>
                          </div>
                        )}
                        <Row justify="end" gutter={8}>
                          <Col>
                            <Button onClick={() => setSelectedDate(null)}>Close</Button>
                          </Col>
                          <Col>
                            <Button
                              type="primary"
                              onClick={() => {
                                handleEdit(daySchedule);
                                setSelectedDate(null);
                              }}
                            >
                              Edit Schedule
                            </Button>
                          </Col>
                        </Row>
                      </Space>
                    );
                  })()}
                </Modal>
              )}

              <Card style={{ marginTop: 16 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Total Shifts This Month"
                      value={
                        mockWorkSchedules.filter(
                          (s) =>
                            s.employeeId === selectedEmployeeId &&
                            isSameMonth(new Date(s.date), selectedMonth),
                        ).length
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Total Hours This Month"
                      value={mockWorkSchedules
                        .filter(
                          (s) =>
                            s.employeeId === selectedEmployeeId &&
                            isSameMonth(new Date(s.date), selectedMonth),
                        )
                        .reduce((sum, s) => sum + s.hoursWorked, 0)
                        .toFixed(1)}
                    />
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </TabPane>
      </Tabs>
    </Space>
  );
};
export default workSchedule;
