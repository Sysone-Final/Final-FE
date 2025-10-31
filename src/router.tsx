import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import RackPage from "./domains/rack/RackPage";
import ServerRoomDashboard from "./domains/serverRoom/pages/ServerRoomDashboard";
import ServerViewPage from "./domains/serverView/pages/ServerViewPage";
import ResourceManagePage from "./domains/resourceManage/pages/ResourceManagePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <ServerRoomDashboard />,
      },
      {
        path: "rack",
        element: <RackPage />,
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
    ],
  },
]);

export default router;
