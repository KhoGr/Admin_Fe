export type WorkingType = 'fulltime' | 'parttime';

export interface StaffModel {
  staff_id: number;
  user_id: number;
  position?: string | null;
  salary?: number | null;
  working_type: WorkingType;
  joined_date?: string | null; // yyyy-mm-dd
  note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StaffCreateRequest {
  user_id: number;
  position?: string;
  salary?: number;
  working_type?: WorkingType;
  joined_date?: string; // yyyy-mm-dd
  note?: string;
}

export interface StaffUpdateRequest {
  position?: string;
  salary?: number;
  working_type?: WorkingType;
  joined_date?: string;
  note?: string;
}
