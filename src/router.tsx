import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ServerRoomDashboard from "./domains/serverRoom/pages/ServerRoomDashboard";
import ServerViewPage from "./domains/serverView/pages/ServerViewPage";
import ResourceManagePage from "./domains/resourceManage/pages/ResourceManagePage";
import LoginPage from "./domains/login/LoginPage";
import RackView from "./domains/serverView/rack/components/RackView";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            path: "dashboard",
            element: <ServerRoomDashboard />,
          },
          {
            path: "server-room-dashboard",
            element: <ServerRoomDashboard />,
          },
          {
            path: "server-room/:id/view",
            element: <ServerViewPage />,
          },
          {
            path: "assets",
            element: <ResourceManagePage />,
          },
          {
            path: "rack",
            element: <RackView />,
          },
        ],
      },
    ],
  },
]);

export default router;
