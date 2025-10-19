import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import RackPage from "./domains/rack/RackPage";
import DataCenter from "./domains/datacenter/DataCenter";
import Babylonmap from "./domains/babylon/Babylonmap";

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
      },
      {
        path: "/rack",
        element: <RackPage />,
      },
    ],
  },
]);

export default router;
