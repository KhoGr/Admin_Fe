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

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "TRANG CHỦ",
    children: [
      {
        name: "Bảng điều khiển",
        icon: "solar:pie-chart-2-outline",
        id: uniqueId(),
        url: "/",
      },
    ],
  },
  {
    heading: "QUẢN LÝ NHÀ HÀNG",
    children: [
      {
        name: "Danh mục món",
        icon: "solar:list-check-line-duotone",
        id: uniqueId(),
        url: "/account/category",
      },
      {
        name: "Thực đơn",
        icon: "solar:hamburger-menu-outline",
        id: uniqueId(),
        url: "/admin/menu-item",
      },
      {
        name: "Đơn hàng",
        icon: "solar:bill-list-outline",
        id: uniqueId(),
        url: "/account/orders",
      },
      {
        name: "Khuyến mãi",
        icon: "solar:tag-price-outline",
        id: uniqueId(),
        url: "/account/promotions",
      },
      {
        name: "Bàn ăn",
        icon: "solar:chair-outline",
        id: uniqueId(),
        url: "/account/tables",
      },
    ],
  },
  {
    heading: "QUẢN LÝ NHÂN SỰ",
    children: [
      {
        name: "Nhân viên",
        icon: "solar:users-group-two-rounded-outline",
        id: uniqueId(),
        url: "/account/staff",
      },
      {
        name: "Khách hàng",
        icon: "solar:users-group-two-rounded-outline",
        id: uniqueId(),
        url: "/account/customers",
      },
      {
        name: "Phân ca",
        icon: "solar:calendar-mark-outline",
        id: uniqueId(),
        url: "/account/shifts",
      },
    ],
  },
  {
    heading: "THỐNG KÊ",
    children: [
      {
        name: "Doanh thu",
        icon: "solar:chart-outline",
        id: uniqueId(),
        url: "/account/revenue",
      },
      {
        name: "Báo cáo",
        icon: "solar:document-text-outline",
        id: uniqueId(),
        url: "/account/reports",
      },
    ],
  },
  {
    heading: "CÀI ĐẶT",
    children: [
      {
        name: "Thông tin nhà hàng",
        icon: "solar:shop-outline",
        id: uniqueId(),
        url: "/account/restaurant-info",
      },
      {
        name: "Tài khoản",
        icon: "solar:user-circle-line-duotone",
        id: uniqueId(),
        url: "/account/profile",
      },
    ],
  },
  {
    heading: "XÁC THỰC",
    children: [
      {
        name: "Đăng nhập",
        icon: "solar:login-2-linear",
        id: uniqueId(),
        url: "/account/login",
      },
      {
        name: "Đăng ký",
        icon: "solar:shield-user-outline",
        id: uniqueId(),
        url: "/account/register",
      },
    ],
  },
];

export default SidebarContent;