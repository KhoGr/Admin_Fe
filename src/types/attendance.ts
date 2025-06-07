// ========== Relations ==========
export type User = {
  user_id: number;
  name: string;
  username: string;
};

export type Staff = {
  staff_id: number;
  position: string | null;
  user: User;
};

export type WorkShift = {
  work_shift_id: number;
  staff_id: number;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'full_day';
  date: string;         // YYYY-MM-DD
  start_time: string;   // HH:mm:ss
  end_time: string;     // HH:mm:ss
  note?: string | null;
};

// ========== Attendance Model ==========
export type Attendance = {
  attendance_id: number;
  staff_id: number;
  work_shift_id: number | null;
  check_in_time: string | null;   // ISO string
  check_out_time: string | null;  // ISO string
  hours_worked: number | null;
  status: 'present' | 'late' | 'absent' | 'on_leave';
  note?: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  staff: Staff;
  work_shift?: WorkShift;
};

// ========== Create Payload ==========
export type AttendanceCreatePayload = {
  staff_id: number;
  work_shift_id?: number | null;
  check_in_time?: string;     // Optional at create
  status?: 'present' | 'late' | 'absent' | 'on_leave';
  note?: string;
};

// ========== Update Payload ==========
export type AttendanceUpdatePayload = {
  check_out_time?: string;    // Usually added after check-in
  status?: 'present' | 'late' | 'absent' | 'on_leave';
  note?: string;
};

// ========== Filter Params for Query ==========
export type AttendanceFilterParams = {
  staffId?: number;
  date?: string;       // YYYY-MM-DD
  month?: string;      // YYYY-MM
  status?: string;
};
