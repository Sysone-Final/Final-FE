import { createBrowserRouter } from "react-router-dom";
import App from "./App";
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
    ],
  },
]);

export default router;
