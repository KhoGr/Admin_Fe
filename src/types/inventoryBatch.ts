export interface InventoryBatchPayload {
  name: string;
  quantity: number;
  unit: string;
  unit_price: number; 
  total_value: number; 
  supplier: string;
  time_added?: string; 
}

export interface InventoryBatchResponse {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_value: number;
  supplier: string;
  time_added: string;
  created_at: string;
  updated_at: string;
}
