import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import RackView from "./domains/rack/RackPage";
import DataCenter from "./domains/datacenter/DataCenter";
import Babylonmap from "./domains/babylon/Babylonmap";
import ServerRoomDashboard from "./domains/serverRoom/pages/ServerRoomDashboard";

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
        element: <RackView />,
      },
      {
        path: "server-room-dashboard",
        element: <ServerRoomDashboard />,
      },
    ],
  },
]);

export default router;
