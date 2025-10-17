import { createBrowserRouter } from 'react-router-dom';
import App from "./App";
import DataCenter from "./domains/datacenter/DataCenter";
import ServerRoomDashboard from './domains/serverRoom/pages/ServerRoomDashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <DataCenter />
      },{
        path: "server-room-dashboard",
        element: <ServerRoomDashboard />
      }
    ]
  }
]);


export default router;