import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import RackPage from "./domains/rack/RackPage";
import DataCenter from "./domains/datacenter/DataCenter";
import Babylonmap from "./domains/view3d/Babylonmap";
import ServerRoomDashboard from "./domains/serverRoom/pages/ServerRoomDashboard";
import ServerRoomDetailView from "./domains/serverRoom/pages/ServerRoomDetailView";
import FloorPlanPage from "./domains/floorPlan/pages/FloorPlanPage";

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
        path: "floor-plan", // 이 주소로 접속하면
        element: <FloorPlanPage />, // FloorPlanPage를 보여준다
      },
    ],
  },
]);

export default router;
