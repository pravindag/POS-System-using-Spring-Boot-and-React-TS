import { createContext, useContext, useEffect, useState } from "react";
import AuthContextType from "../types/AuthContextType";
import AuthProviderPropsType from "../types/AuthProviderPropsType";

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    jwtToken: null,
    userRole: null,
    loading: true,
    login: () => {},
    logout: () => {}
});

export function AuthProvider({children}: AuthProviderPropsType ) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const login = ( token: string, role: string ) => {
        setIsAuthenticated(true);
        setJwtToken(token);
        setUserRole(role);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
    }

    const logout = () => {
        setIsAuthenticated(false);
        setJwtToken(null);
        setUserRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if(token) {
            setIsAuthenticated(true);
            setJwtToken(token);
            setUserRole(role);
        }
        setLoading(false);
    },[])

    return (
        <AuthContext.Provider value={{ isAuthenticated, jwtToken, userRole, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}