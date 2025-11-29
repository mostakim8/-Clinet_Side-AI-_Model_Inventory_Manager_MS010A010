import { createBrowserRouter, Outlet } from "react-router-dom";

// Layout & Wrappers
import MainLayout from "../layouts/MainLayouts"
import PrivateRoute from "./PrivateRoute";

// Error Page
import ErrorPage from "../pages/NotFound/NotFound404"; // Please ensure this component exists

// Public Pages
import {Home} from "../pages/Home/Home";
import {Login} from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProfileUpdate from "../pages/ProfileUpdate/ProfileUpdate"; 

import ViewModels from "../pages/Model/ViewModels";
import {ModelDetails} from "../pages/Model/ModelDetails";
import UpdateModel from "../pages/Model/UpdateModel";
// Private Pages
import AddModel from "../pages/Model/AddModel";
import MyModels from "../pages/Model/MyModels";


import {PurchaseHistory} from "../pages/PurchaseHistory/PurchaseHistory"; // Apnar file structure onujayi jug kora holo

// Loader Function for UpdateModel: Update korar age data fetch korbe
const SERVER_BASE_URL = 'http://localhost:5001';

const updateModelLoader = async ({ params }) => {
    const id = params.id;
    // Public GET call, token dorkar nei
    const res = await fetch(`${SERVER_BASE_URL}/models/${id}`);
    
    if (!res.ok) {
        throw new Response("Model Not Found", { status: 404 });
    }
    return res.json();
};


const Routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        // Apnar screenshot theke ErrorPage.jsx use kora holo
        errorElement: <ErrorPage />, 
        children: [
            // --- Public Routes ---
            { 
                index: true, 
                element: <Home /> 
            },
            {
              path: "models",
              element:<ViewModels />
            },
            // Model Details Route: Dynamic path byabohar kora holo
            { 
                path: "model/:id", 
                element: <ModelDetails /> 
            },
            
            // Auth Routes
            { path: "login", element: <Login /> },
            { path: "register", element: <Register/> },
            
            // --- Protected Routes (Requires Authentication) ---
            {
                // PrivateRoute wrapper byabohar kora holo
                element: <PrivateRoute><Outlet /></PrivateRoute>,
                children: [
                    { path: "add-model", element: <AddModel /> },
                    { path: "my-models", element: <MyModels /> },
                    { 
                        path: "update-model/:id", 
                        element: <UpdateModel />,
                        loader: updateModelLoader, // Data loader jug kora holo
                    },
                    { path: "purchase-history", element: <PurchaseHistory /> },
                    { path: "profile-update", element: <ProfileUpdate /> },
                ]
            }
        ],
    },
]);

export default Routes;