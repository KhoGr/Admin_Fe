export type ShiftType = "morning" | "afternoon" | "evening" | "full_day";

export interface WorkShift {
  work_shift_id: number;
  staff_id: number;
  shift_type: ShiftType;
  date: string;         // ISO format: "YYYY-MM-DD"
  start_time: string;   // format: "HH:mm:ss"
  end_time: string;     // format: "HH:mm:ss"
  note?: string | null;
  created_at: string;   // ISO datetime string
  updated_at: string;   // ISO datetime string

  staff?: Staff; // optional, populated when expanded
}
export interface CreateWorkShiftDto {
  staff_id: number;
  shift_type: ShiftType;
  date: string;
  start_time: string;
  end_time: string;
  note?: string;
}

export interface UpdateWorkShiftDto {
  shift_type?: ShiftType;
  date?: string;
  start_time?: string;
  end_time?: string;
  note?: string;
}
export interface Account {
  email: string;
}

export interface User {
  user_id: number;
  account_id: number;
  name: string;
  username: string;
  avatar: string | null;
  phone: string | null;
  address: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
  account: Account;
}
export type WorkingType = "fulltime" | "parttime";

export interface Staff {
  staff_id: number;
  user_id: number;
  position: string;
  salary: string; // formatted as string, e.g., "80000.00"
  working_type: WorkingType;
  joined_date: string;
  note?: string | null;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}