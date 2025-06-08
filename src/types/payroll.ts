import { StaffModel } from './staff';

export type PayrollStatus = 'pending' | 'paid';

export interface Payroll {
  payroll_id: number;
  staff_id: number;
  period_start: string; // YYYY-MM-DD
  period_end: string;   // YYYY-MM-DD
  total_hours: number;
  total_salary: number;
  status: PayrollStatus;
  note?: string | null;
  created_at: string;
  updated_at: string;

  // Quan hệ: có thể có thông tin nhân viên đi kèm
  staff?: StaffModel;
}

export interface PayrollCreatePayload {
  staff_id: number;
  period_start: string; // YYYY-MM-DD
  period_end: string;   // YYYY-MM-DD
  note?: string;
  status?:string;
}

export interface PayrollStatusUpdatePayload {
  status: PayrollStatus;
}
