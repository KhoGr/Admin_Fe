import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button, DatePicker, Form, Input, InputNumber, Select, Typography, Space } from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;
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
interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  startDate: Date;
}

const mockEmployees: Employee[] = [
  {
    id: 'e1',
    name: 'Robert Chen',
    position: 'Head Chef',
    email: 'robert.c@restaurant.com',
    phone: '555-111-2222',
    startDate: new Date(2020, 1, 10),
  },
  {
    id: 'e2',
    name: 'Lisa Wong',
    position: 'Manager',
    email: 'lisa.w@restaurant.com',
    phone: '555-222-3333',
    startDate: new Date(2020, 3, 15),
  },
  {
    id: 'e3',
    name: 'James Rodriguez',
    position: 'Waiter',
    email: 'james.r@restaurant.com',
    phone: '555-333-4444',
    startDate: new Date(2021, 5, 20),
  },
  {
    id: 'e4',
    name: 'Maria Garcia',
    position: 'Bartender',
    email: 'maria.g@restaurant.com',
    phone: '555-444-5555',
    startDate: new Date(2021, 8, 5),
  },
  {
    id: 'e5',
    name: 'Daniel Kim',
    position: 'Sous Chef',
    email: 'daniel.k@restaurant.com',
    phone: '555-555-6666',
    startDate: new Date(2022, 2, 12),
  },
];

type Stats = {
  totalRevenue: number;
  ordersToday: number;
  newCustomers: number;
  popularDishes: { name: string; count: number }[];
};

export const mockStats: Stats = {
  totalRevenue: 5843.75,
  ordersToday: 47,
  newCustomers: 12,
  popularDishes: [
    { name: 'Grilled Salmon', count: 24 },
    { name: 'Beef Tenderloin', count: 18 },
    { name: 'Chocolate Lava Cake', count: 15 },
    { name: 'Classic Mojito', count: 32 },
  ],
};

const formSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  hoursWorked: z.coerce
    .number()
    .min(0.5, 'Hours must be at least 0.5')
    .max(24, 'Hours cannot exceed 24'),
  hourlyRate: z.coerce.number().min(1, 'Rate must be at least 1'),
  notes: z.string().optional(),
});

type WorkScheduleFormProps = {
  initialData: WorkSchedule | null;
  onSave: (data: WorkSchedule) => void;
  onCancel: () => void;
  preselectedEmployeeId?: string;
};

export function WorkScheduleForm({
  initialData,
  onSave,
  onCancel,
  preselectedEmployeeId,
}: WorkScheduleFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          employeeId: initialData.employeeId,
          date: initialData.date.toISOString().split('T')[0],
          hoursWorked: initialData.hoursWorked,
          hourlyRate: initialData.hourlyRate,
          notes: initialData.notes || '',
        }
      : {
          employeeId: preselectedEmployeeId || '',
          date: new Date().toISOString().split('T')[0],
          hoursWorked: 8,
          hourlyRate: 15,
          notes: '',
        },
  });

  const hoursWorked = watch('hoursWorked');
  const hourlyRate = watch('hourlyRate');

  useEffect(() => {
    if (hoursWorked && hourlyRate) {
      setValue('notes', watch('notes'));
    }
  }, [hoursWorked, hourlyRate, setValue, watch]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedEmployee = mockEmployees.find((e) => e.id === values.employeeId);
    const totalPay = values.hoursWorked * values.hourlyRate;

    const workSchedule: WorkSchedule = {
      id: initialData?.id || `ws${Math.random().toString(36).substring(2, 9)}`,
      employeeId: values.employeeId,
      employeeName: selectedEmployee?.name || '',
      date: new Date(values.date),
      hoursWorked: values.hoursWorked,
      hourlyRate: values.hourlyRate,
      totalPay,
      notes: values.notes,
    };

    onSave(workSchedule);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        name="employeeId"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Employee"
            validateStatus={errors.employeeId ? 'error' : ''}
            help={errors.employeeId?.message}
          >
            <Select {...field} disabled={!!preselectedEmployeeId} placeholder="Select employee">
              {mockEmployees.map((emp) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.position})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      />

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Work Date"
            validateStatus={errors.date ? 'error' : ''}
            help={errors.date?.message}
          >
            <DatePicker
              {...field}
              format="YYYY-MM-DD"
              value={dayjs(field.value)}
              onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
            />
          </Form.Item>
        )}
      />

      <Space size="large" style={{ display: 'flex' }}>
        <Controller
          name="hoursWorked"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Hours Worked"
              validateStatus={errors.hoursWorked ? 'error' : ''}
              help={errors.hoursWorked?.message}
            >
              <InputNumber {...field} min={0.5} max={24} step={0.5} style={{ width: '100%' }} />
            </Form.Item>
          )}
        />

        <Controller
          name="hourlyRate"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Hourly Rate ($)"
              validateStatus={errors.hourlyRate ? 'error' : ''}
              help={errors.hourlyRate?.message}
            >
              <InputNumber {...field} min={1} step={0.01} prefix="$" style={{ width: '100%' }} />
            </Form.Item>
          )}
        />
      </Space>

      <div style={{ background: '#f6f6f6', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <Title level={5}>Total Pay: ${(hoursWorked * hourlyRate).toFixed(2)}</Title>
      </div>

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Notes"
            validateStatus={errors.notes ? 'error' : ''}
            help={errors.notes?.message}
          >
            <TextArea {...field} rows={4} placeholder="Any additional notes about this shift..." />
          </Form.Item>
        )}
      />

      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialData ? 'Update' : 'Add'} Work Schedule
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
