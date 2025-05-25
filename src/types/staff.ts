export type WorkingType = 'full_time' | 'part_time' ;

export interface StaffModel {
  staff_id: number;
  user_id: number;
  position: string;
  salary: number | string; 
  working_type: WorkingType;
  joined_date: string; 
  note?: string | null;
  created_at: string;
  updated_at: string;

  user?: {
    user_id: number;
    name: string;
    username: string;
    avatar?: string;
    phone?: string;
    address?: string;
    role?: string;
    account?: {
      email: string;
    };
    created_at?: string;
    updated_at?: string;
  };
}

export interface StaffCreateRequest {
  user_id: number;
  position?: string;
  salary?: number;
  working_type?: WorkingType;
  joined_date?: string; // ISO string
  note?: string;
}

export interface StaffUpdateRequest {
  position?: string;
  salary?: number;
  working_type?: WorkingType;
  joined_date?: string; // ISO string
  note?: string;
}
