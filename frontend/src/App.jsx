import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import { UserContextProvider } from "./store/user-context";
import UserHome from "./pages/UserHome/UserHome";

import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ListSpace from "./pages/UserHome/ListSpace";
import DashBoard from "./pages/UserHome/DashBoard";
import Parking from "./pages/UserHome/Parking";
import Error from "./pages/Error";
import { ParkingContextProvider } from "./store/parking-lots";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <Error />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            path: "/user/",
            element: <UserHome />,
          },
          {
            path: "/user/list-a-space/",
            element: <ListSpace />
          },
          {
            path: "/user/dashboard",
            element: <DashBoard />
          },
          {
            path: "/user/booking",
            element: <Parking />
          }
        ]
      },
      {
        path: "/admin",
        element: <AdminLayout />,
      }
    ],
  },
  {
    path: "/parking/:id",
    element: <Parking />
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login/",
        element: <Login />
      },
      {
        path: "register/",
        element: <Register />
      }
    ]
  },
]);

function App() {
  return (
    <ParkingContextProvider>
      <UserContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </UserContextProvider>
    </ParkingContextProvider>
  );
}

export default App;
