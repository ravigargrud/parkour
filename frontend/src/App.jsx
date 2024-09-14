import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import { UserContextProvider } from "./store/user-context";
import UserHome from "./pages/UserHome/UserHome";

import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            path: "/user/",
            element: <UserHome />,
          }
        ]
      },
      {
        path: "/admin",
        element: <AdminLayout />,
      }
    ],
  },
]);

function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </UserContextProvider>
  );
}

export default App;
