import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import RackPage from "./domains/rack/RackPage";
import DataCenter from "./domains/datacenter/DataCenter";
import Babylonmap from "./domains/view3d/Babylonmap";
import ServerRoomDashboard from "./domains/serverRoom/pages/ServerRoomDashboard";
import ServerRoomDetailView from "./domains/serverRoom/pages/ServerRoomDetailView";
import FloorPlanPage from "./domains/floorPlan/pages/FloorPlanPage";
import ResourceManagePage from "./domains/resourceManage/pages/ResourceManagePage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <DataCenter />,
      },
      {
        path: "datacenterview",
        element: <DataCenter />,
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
        element: <ServerRoomDetailView />,
      },
      {
        path: "floor-plan", 
        element: <FloorPlanPage />, 
      },
       {
        path: "assets", 
        element: <ResourceManagePage />, 
      },
    ],
  },
]);

export default router;
