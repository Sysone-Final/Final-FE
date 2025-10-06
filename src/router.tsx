import { createBrowserRouter } from 'react-router-dom';
import App from "./App";
import DataCenter from "./domains/datacenter/DataCenter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <DataCenter />
      }
    ]
  }
]);


export default router;