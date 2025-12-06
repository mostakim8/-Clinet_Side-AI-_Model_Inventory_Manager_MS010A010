import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'; 

const PrivateRoute = ({ children }) => {
   
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    
    if (user) {
        return children;
    }

    
    return  <Navigate to="/login" 
    state={{ from: location 
     }} 
    replace 
    />;
};

export default PrivateRoute;