interface AuthContextType {
    isAuthenticated: boolean;
    jwtToken: string | null;
    userRole: string | null;
    loading: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
}

export default AuthContextType;