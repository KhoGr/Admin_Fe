export interface MenuItem {
  item_id: string;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  discount_percent: number;
  is_available: boolean;
  is_combo: boolean;
  stock_quantity?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItemDTO {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  discount_percent?: number;
  is_available?: boolean;
  is_combo?: boolean;
  stock_quantity?: number;
  image_url?: string;
}

export interface UpdateMenuItemDTO {
  category_id?: number;
  name?: string;
  description?: string;
  price?: number;
  discount_percent?: number;
  is_available?: boolean;
  is_combo?: boolean;
  stock_quantity?: number;
  image_url?: string;
}
export interface MenuItemTableProps {
  items: MenuItem[];
  onDetail: (item: MenuItem) => void;
}