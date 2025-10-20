import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import DataCenter from "./domains/datacenter/DataCenter";
import Babylonmap from "./domains/view3d/Babylonmap";
import ServerRoomDashboard from "./domains/serverRoom/pages/ServerRoomDashboard";
import ServerRoomDetailView from "./domains/serverRoom/pages/ServerRoomDetailView";

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
        path: "server-room-dashboard",
        element: <ServerRoomDashboard />,
      },
      {
        path: "server-room/:id/view",
        element: <ServerRoomDetailView />,
      },
    ],
  },
]);

export default router;
