export type TableStatus = 'available' | 'occupied' | 'reserved' | 'unavailable';

export type Table = {
  table_id: number;
  table_number: string;
  status: TableStatus;
  seat_count: number;    
  floor?: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface CreateTableDto {
  table_number: string;
  status: TableStatus;
  seat_count: number;
  floor?: number;
  note?: string;
}

export interface UpdateTableDto extends Partial<CreateTableDto> {}
