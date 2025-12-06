import { createBrowserRouter, Outlet } from "react-router-dom";

// Layout
import MainLayout from "../layouts/MainLayouts";

import PrivateRoute from "./PrivateRoute";

// pages
import WelcomeScreen from "../pages/Welcome/WelcomeScreen";
// Error Page
import ErrorPage from "../pages/NotFound/NotFound404";  
import {Login} from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import {Home} from "../pages/Home/Home";
import ViewModels from "../pages/Model/ViewModels";
import AddModel from "../pages/Model/AddModel";

import MyModels from "../pages/Model/MyModels";
import UpdateModel from "../pages/Model/UpdateModel";
import {PurchaseHistory} from "../pages/PurchaseHistory/PurchaseHistory"; 

import {ModelDetails} from "../pages/Model/ModelDetails";

import ProfileUpdate from "../pages/ProfileUpdate/ProfileUpdate"; 

const SERVER_BASE_URL = 'http://localhost:5001';

const updateModelLoader = async ({ params }) => {


    const id = params.id;
    const res = await fetch(`${SERVER_BASE_URL}/models/${id}`);
    
    if (!res.ok) {
        throw new Response("Model Not Found", { status: 404 });
    }
    return res.json();
};


const Routes = createBrowserRouter([
    {
        path: "/",
        element: <WelcomeScreen />, 
        errorElement: <ErrorPage />, 
    },
    
    { 
        path: "login", 
        element: <Login /> 
    },
    { 
        path: "register", 
        element: <Register/> 
    },

    {
        path: "/app",
        element:
             <PrivateRoute><MainLayout />
             </PrivateRoute>,

        errorElement: <ErrorPage />,

        children: [
            { 
                index: true, 
                element: <Home /> 
            },

            {
              path: "models", 
              element:<ViewModels />
            },
           
            { 
                path: "add-model", 
                element: <AddModel />
            },

            { 
                path: "my-models", 
                element: <MyModels /> 
            },

            { 
                path: "update-model/:id", 
                element: <UpdateModel />,
                loader: updateModelLoader, 
            },

            { 
                path: "purchase-history",
                element: <PurchaseHistory /> 
            },

            { 
                path: "model/:id", 
                element: <ModelDetails /> 
            },
           
            { 
                path: "profile-update",
                element: <ProfileUpdate /> 
            },
        ],
    },
]);

export default Routes;