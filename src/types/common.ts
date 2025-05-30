/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NotificationItem {
    id: number;
    title: string;
    user: string;
}
export interface ChildItem {
    id?: number | string;
    name?: string;
    icon?: any;
    children?: ChildItem[];
    item?: any;
    url?: any;
    color?: string;
  }
  
  export interface MenuItem {
    heading?: string;
    name?: string;
    icon?: any;
    id?: number;
    to?: string;
    items?: MenuItem[];
    children?: ChildItem[];
    url?: any;
  }

  export interface NavItemsprops{
    item: ChildItem;
  }
