import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'; // Path shothik kora holo

const PrivateRoute = ({ children }) => {
    // AuthProvider theke user ebong loading state nawa
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. Authentication check cholche
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                {/* Tailwind/DaisyUI loading spinner */}
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // 2. User authenticated hole, children component (protected page) dekhano hobe
    if (user) {
        return children;
    }

    // 3. User authenticated na hole, login page-e redirect kora hobe
    // State-e current location path pathano hobe jate login-er por shei page-e phire jawa jay
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;