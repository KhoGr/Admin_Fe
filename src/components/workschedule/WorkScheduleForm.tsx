import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button, DatePicker, Form, Input, Select, Space, TimePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { StaffModel } from '../../types/staff';
import { WorkShift, ShiftType, CreateWorkShiftDto } from '../../types/workship';

const { TextArea } = Input;
const { Title } = Typography;

const shiftTypes = ['morning', 'afternoon', 'evening', 'full_day'] as const;

const formSchema = z.object({
  staff_id: z.coerce.number({ required_error: 'Employee is required' }),
  date: z.string().min(1, 'Date is required'),
  shift_type: z.enum(['morning', 'afternoon', 'evening', 'full_day']),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type WorkShiftFormProps = {
  initialData?: WorkShift | null;
  staffList: StaffModel[];
  onSave: (data: CreateWorkShiftDto) => void;
  onCancel: () => void;
};

export function WorkScheduleForm({
  initialData,
  staffList,
  onSave,
  onCancel,
}: WorkShiftFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          staff_id: initialData.staff_id,
          date: initialData.date,
          shift_type: initialData.shift_type,
          start_time: initialData.start_time,
          end_time: initialData.end_time,
          note: initialData.note || '',
        }
      : {
          staff_id: staffList[0]?.staff_id ?? 0,
          date: dayjs().format('YYYY-MM-DD'),
          shift_type: 'morning',
          start_time: '08:00:00',
          end_time: '12:00:00',
          note: '',
        },
  });

  const onSubmit = (values: FormValues) => {
    const payload: CreateWorkShiftDto = {
      staff_id: values.staff_id,
      date: values.date,
      shift_type: values.shift_type,
      start_time: values.start_time,
      end_time: values.end_time,
      note: values.note,
    };
    onSave(payload);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        name="staff_id"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Employee"
            validateStatus={errors.staff_id ? 'error' : ''}
            help={errors.staff_id?.message}
          >
            <Select {...field} placeholder="Select employee">
              {staffList.map((emp) => (
                <Select.Option key={emp.staff_id} value={emp.staff_id}>
                  {emp.user?.name} ({emp.position})
                </Select.Option>
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
              value={dayjs(field.value)}
              format="YYYY-MM-DD"
              onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
            />
          </Form.Item>
        )}
      />

      <Controller
        name="shift_type"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="Shift Type"
            validateStatus={errors.shift_type ? 'error' : ''}
            help={errors.shift_type?.message}
          >
            <Select {...field}>
              {shiftTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      />

      <Space style={{ display: 'flex' }} size="large">
        <Controller
          name="start_time"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Start Time"
              validateStatus={errors.start_time ? 'error' : ''}
              help={errors.start_time?.message}
            >
              <TimePicker
                {...field}
                format="HH:mm:ss"
                value={dayjs(field.value, 'HH:mm:ss')}
                onChange={(t) => field.onChange(t?.format('HH:mm:ss'))}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="end_time"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="End Time"
              validateStatus={errors.end_time ? 'error' : ''}
              help={errors.end_time?.message}
            >
              <TimePicker
                {...field}
                format="HH:mm:ss"
                value={dayjs(field.value, 'HH:mm:ss')}
                onChange={(t) => field.onChange(t?.format('HH:mm:ss'))}
              />
            </Form.Item>
          )}
        />
      </Space>

      <Controller
        name="note"
        control={control}
        render={({ field }) => (
          <Form.Item label="Note" help={errors.note?.message}>
            <TextArea {...field} rows={3} placeholder="Optional notes..." />
          </Form.Item>
        )}
      />

      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialData ? 'Update' : 'Create'} Shift
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
