
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";

/* Layouts */
const BlankLayout = Loadable(lazy(() => import("../layouts/blank/BlankLayout")));
const RootProtected =Loadable(lazy(()=>import("../layouts/RootProtected")))

/* Pages */
const Dashboard = Loadable(lazy(() => import("../pages/dashboards/Dashboard")));
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Profile=Loadable(lazy(()=>import("../pages/profile/Profile")));
const EditProfile =Loadable(lazy(()=>import("../pages/profile/EditProfile")));
const ProductDetail=Loadable(lazy(()=>import("../components/product/ProductDetail")));
const CategoryPage=Loadable(lazy(()=>import("../pages/category/Category")))
const MenuItemPage=Loadable(lazy(()=>import("../pages/menuItem/menuItem")))
const CustomerPage=Loadable(lazy(()=>import("../pages/customer/CustomerPage")))
const StaffPage=Loadable(lazy(()=>import("../pages/staff/StaffPage")))
const OrderPage=Loadable(lazy(()=>import("../pages/order/OrderPage")))
const CommentsPage=Loadable(lazy(()=>import("../pages/comment/CommentPage")))
const MonthlyRevenue=Loadable(lazy(()=>import("../pages/monthly/MonthlyRevenue")))
const Inventory=Loadable(lazy(()=>import("../pages/inventory/inventoryPage")))
const SettingsPage=Loadable(lazy(()=>import("../pages/setting/Settings")))
const WorkSchedulePage=Loadable(lazy(()=>import("../pages/workSchedule/WorkSchedule")))
const ChatbotPage=Loadable(lazy(()=>import("../pages/chatbot/ChatBot")))
const TablePage=Loadable(lazy(()=>import("../pages/table/TablePage")))
const VipPage=Loadable(lazy(()=>import("../pages/vip/VipCustomers")))
const VoucherPage=Loadable(lazy(()=>import("../pages/voucher/voucherPage")))
const AttendancePage=Loadable(lazy(()=>import("../pages/attendance/AttendancePage")))
const PayrollPage=Loadable(lazy(()=>import("../pages/payroll/PayrollPage")))
const AdminQrCode=Loadable(lazy(()=>import("../pages/qr/AdminQrCode")))



const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootProtected />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      {path:"/account/profile",element:<Profile/>},
      {path:"/account/edit-profile",element:<EditProfile/>},
      {path:"/account/product-detail",element:<ProductDetail/>},
      {path:"/account/category",element:<CategoryPage/>},
      {path:"/admin/menu-item",element:<MenuItemPage/>},
      {path:"/admin/customer",element:<CustomerPage/>},
      {path:"/admin/staff",element:<StaffPage/>},
      {path:"/admin/order",element:<OrderPage/>},
      {path:"/admin/comment",element:<CommentsPage/>},
      {path:"/admin/monthly-revenue",element:<MonthlyRevenue/>},
      {path:"/admin/inventory",element:<Inventory/>},
      {path:"/admin/settings",element:<SettingsPage/>},
      {path:"/admin/work-schedule",element:<WorkSchedulePage/>},
      {path:"/admin/chatbot",element:<ChatbotPage/>},
      {path:"/admin/table",element:<TablePage/>},
      {path:"/admin/vip",element:<VipPage/>},
      {path:"/admin/voucher",element:<VoucherPage/>},
      {path:"/admin/attendance",element:<AttendancePage/>},
      {path:"/admin/payroll",element:<PayrollPage/>},
      {path:"/admin/qr",element:<AdminQrCode/>}

    ],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      {
        path: "/account/login",
        element: (
            <Login />
        ),
      },

    ],
  },
]);

export default Router;
