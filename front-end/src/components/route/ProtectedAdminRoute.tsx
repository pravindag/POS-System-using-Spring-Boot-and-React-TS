import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingGif from "../LoadingGif";

const ProtectedAdminRoute = () => {

    const { isAuthenticated, userRole, loading } = useAuth();

    if (!loading) {
        if (isAuthenticated && userRole == "admin") {
            return <Outlet />
        } 
        return <Navigate to="/auth/login" />
        
    }else{
        return <LoadingGif />;
    }
}

export default ProtectedAdminRoute;