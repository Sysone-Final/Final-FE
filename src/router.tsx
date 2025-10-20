import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import DataCenter from "./domains/datacenter/DataCenter";
import Babylonmap from "./domains/babylon/Babylonmap";
import ServerRoomDashboard from './domains/serverRoom/pages/ServerRoomDashboard';
import FloorPlanPage from './domains/floorPlan/pages/FloorPlanPage';
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
<<<<<<< HEAD
      },
      {
    path: "/floor-plan", // 이 주소로 접속하면
    element: <FloorPlanPage />, // FloorPlanPage를 보여준다
  },
    ],
  },
=======
      },  {
    path: "/floor-plan", // 이 주소로 접속하면
    element: <FloorPlanPage />, // FloorPlanPage를 보여준다
  },
    ]
  }
>>>>>>> aa21152 (레이아웃 구성 및 모드전환)
]);

export default router;
