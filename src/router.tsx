import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Rack from "./domains/rack/components/Rack";
import DataCenter from "./domains/datacenter/DataCenter";

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
        path: "/rack",
        element: <Rack />,
      },
    ],
  },
]);

export default router;
