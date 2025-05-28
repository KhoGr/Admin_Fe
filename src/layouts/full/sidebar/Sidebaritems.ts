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
        url: "/admin/order",
      },
      {
        name: "Bình luận",
        icon: "solar:chat-round-line-outline",
        id: uniqueId(),
        url: "/admin/comment",
      },
      {
        name: "Kho hàng",
        icon: "solar:box-outline",
        id: uniqueId(),
        url: "/admin/inventory",
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
        url: "/admin/staff",
      },
      {
        name: "Khách hàng",
        icon: "solar:user-id-outline",
        id: uniqueId(),
        url: "/admin/customer",
      },
      {
        name: "Lịch làm việc",
        icon: "solar:calendar-outline",
        id: uniqueId(),
        url: "/admin/work-schedule",
      },
    ],
  },
  {
    heading: "THỐNG KÊ",
    children: [
      {
        name: "Doanh thu hàng tháng",
        icon: "solar:chart-square-outline",
        id: uniqueId(),
        url: "/admin/monthly-revenue",
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
        url: "/admin/settings",
      },
      {
        name: "Tài khoản của tôi",
        icon: "solar:user-circle-line-duotone",
        id: uniqueId(),
        url: "/account/profile",
      },
      {
        name: "Chỉnh sửa hồ sơ",
        icon: "solar:pen-new-square-linear",
        id: uniqueId(),
        url: "/account/edit-profile",
      },
      {
        name: "Chi tiết sản phẩm",
        icon: "solar:tag-outline",
        id: uniqueId(),
        url: "/account/product-detail",
      },
    ],
  },
  {
    heading: "HỖ TRỢ",
    children: [
      {
        name: "Chatbot",
        icon: "solar:robot-outline",
        id: uniqueId(),
        url: "/admin/chatbot",
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
    ],
  },
];

export default SidebarContent;