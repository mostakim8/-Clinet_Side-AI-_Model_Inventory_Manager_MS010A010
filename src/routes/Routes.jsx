import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayouts";


import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login"; 
import Register from "../pages/Auth/Register";
import AddModel from "../pages/Model/AddModel";
import MyModels from "../pages/Model/MyModels";


import PrivateRoute from "./PrivateRoute";
import UpdateModel from "../pages/Model/UpdateModel";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
          path:"/add-model",
           element: <PrivateRoute>
            <AddModel/>
           </PrivateRoute>
      },
      {
        path:"/my-models",
        element:<PrivateRoute><MyModels/></PrivateRoute>
      },
       {
                path: 'update-model/:id',
                element: <PrivateRoute><UpdateModel /></PrivateRoute>,
                // use loader for data load
                loader: ({ params }) => fetch(`http://localhost:5001/models/${params.id}`)
            },
      // Add other public routes here (e.g., /models)
    ],
  },
  // Add a separate layout for the dashboard/private area later
]);

export default routes;