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
