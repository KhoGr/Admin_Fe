
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
      {path:"/admin/customer",element:<CustomerPage/>}

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
