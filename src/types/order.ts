export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  orders: number;
  totalSpent: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  image: string;
  available: boolean;
  stock: number; // Added stock property
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  startDate: Date;
}

export interface Stats {
  totalRevenue: number;
  ordersToday: number;
  newCustomers: number;
  popularDishes: { name: string; count: number }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: "order" | "user" | "system";
}

export interface MonthlyRevenue {
  id: string;
  month: string;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  topSellingItems: { name: string; revenue: number }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  totalValue: number;
  lastRestocked: Date;
  minimumStock: number;
  supplier: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'canceled';
  createdAt: Date;
  tableNumber?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// New interface for comments
export interface Comment {
  id: string;
  menuItemId: string;
  menuItemName: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: Date;
}

// New interface for employee work schedule
export interface WorkSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  hoursWorked: number;
  hourlyRate: number;
  totalPay: number;
  notes?: string;
}
