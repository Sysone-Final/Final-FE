import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import RackPage from "./domains/rack/RackPage";
import Babylonmap from "./domains/serverView/view3d/pages/Babylonmap";
import FloorPlanPage from "./domains/serverView/floorPlan/pages/FloorPlanPage";
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
        element: <Babylonmap />,
      },
      {
        path: "floor-plan", 
        element: <FloorPlanPage />, 
      },
      {
        path: "babylonmap",
        element: <Babylonmap />,
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
