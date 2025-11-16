import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Auth context  user, loading state 
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // 1. Loading state handle করা
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    
    if (user && !user.isAnonymous) {
        return children;
    }

    
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;