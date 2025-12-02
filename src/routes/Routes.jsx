import { createBrowserRouter, Outlet } from "react-router-dom";

// Layout & Wrappers
import MainLayout from "../layouts/MainLayouts"
import PrivateRoute from "./PrivateRoute";

// Error Page
import ErrorPage from "../pages/NotFound/NotFound404"; 

// Public Pages (যেগুলো লগইন ছাড়াই অ্যাক্সেস করা যায়)
import WelcomeScreen from "../pages/Welcome/WelcomeScreen"; 
import {Login} from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// App Content (লগইন করা আবশ্যক)
import {Home} from "../pages/Home/Home";
import ProfileUpdate from "../pages/ProfileUpdate/ProfileUpdate"; 
import ViewModels from "../pages/Model/ViewModels";
import {ModelDetails} from "../pages/Model/ModelDetails";
import UpdateModel from "../pages/Model/UpdateModel";
import AddModel from "../pages/Model/AddModel";
import MyModels from "../pages/Model/MyModels";
import {PurchaseHistory} from "../pages/PurchaseHistory/PurchaseHistory"; 

// Loader Function for UpdateModel (আগের মতো থাকবে)
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
        // 1. প্রধান এন্ট্রি পয়েন্ট: WelcomeScreen (লগইন না করা ইউজারদের জন্য)
        path: "/",
        element: <WelcomeScreen />, 
        errorElement: <ErrorPage />, 
    },
    
    // 2. Auth Routes: এগুলিই একমাত্র পেজ যা লগইন না করে দেখা যাবে
    { path: "login", element: <Login /> },
    { path: "register", element: <Register/> },

    // 🔑 3. /app রুট: সমস্ত মূল অ্যাপ্লিকেশনের কনটেন্ট (সম্পূর্ণ সুরক্ষিত)
    {
        path: "/app",
        // 🔑 পুরো MainLayout-কে PrivateRoute দিয়ে র‍্যাপ করা হয়েছে
        element: <PrivateRoute><MainLayout /></PrivateRoute>,
        errorElement: <ErrorPage />,
        children: [
            // --- এই চাইল্ড রুটগুলো অ্যাক্সেস করতে হলে অবশ্যই লগইন করতে হবে ---
            { 
                index: true, 
                element: <Home /> 
            },
           
            { 
                path: "model/:id", 
                element: <ModelDetails /> 
            },
             {
              path: "models", 
              element:<ViewModels />
            },
            { path: "add-model", element: <AddModel /> },
            { path: "my-models", element: <MyModels /> },
            { 
                path: "update-model/:id", 
                element: <UpdateModel />,
                loader: updateModelLoader, 
            },
            { path: "purchase-history", element: <PurchaseHistory /> },
            { path: "profile-update", element: <ProfileUpdate /> },
        ],
    },
]);

export default Routes;