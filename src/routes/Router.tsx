
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";

/* Layouts */
const BlankLayout = Loadable(lazy(() => import("../layouts/blank/BlankLayout")));
const RootProtected =Loadable(lazy(()=>import("../layouts/RootProtected")))
const BlankRootLayout =Loadable(lazy(()=>import("../layouts/blank/BlankRootprotect")))

/* Pages */
const Dashboard = Loadable(lazy(() => import("../pages/dashboards/Dashboard")));
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Register = Loadable(lazy(() => import("../pages/auth/Register")));
const Profile=Loadable(lazy(()=>import("../pages/profile/Profile")));
const EditProfile =Loadable(lazy(()=>import("../pages/profile/EditProfile")));
const ProductDetail=Loadable(lazy(()=>import("../components/product/ProductDetail")));




const Router = createBrowserRouter([
  {
    path: "/",
    element: <RootProtected />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      {path:"/account/profile",element:<Profile/>},
      {path:"/account/edit-profile",element:<EditProfile/>},
      {path:"/account/product-detail",element:<ProductDetail/>}

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
      {
        path: "/account/register",
        element: (
            <Register />
        ),
      },
    ],
  },
]);

export default Router;
