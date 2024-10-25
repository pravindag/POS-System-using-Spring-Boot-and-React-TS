import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import LoadingGif from "../LoadingGif";

const ProtectedUserRoute = () => {

    const { isAuthenticated, userRole, loading } = useAuth();

    if (!loading) {
        if (isAuthenticated && userRole == "user") {
            return <Outlet />
        }
        
        return <Navigate to="/auth/login" />
    }else{
        return <LoadingGif />;
    }
    
}

export default ProtectedUserRoute;