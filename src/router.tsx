import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import DataCenter from "./domains/datacenter/DataCenter";
import Babylonmap from "./domains/babylon/Babylonmap";
import ServerRoomDashboard from './domains/serverRoom/pages/ServerRoomDashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "datacenterview",
        element: <DataCenter />,
      },
      {
        path: "babylonmap",
        element: <Babylonmap />,
      },
      {
        path: "",
        element: <DataCenter />,
      },{
        path: "server-room-dashboard",
        element: <ServerRoomDashboard />
      },
    ],
  },
]);

export default router;
