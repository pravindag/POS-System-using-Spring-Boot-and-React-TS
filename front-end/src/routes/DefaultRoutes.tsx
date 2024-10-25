import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import NotFound from "../pages/error/NotFound";

const DefaultRoutes = () => {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        )
}

export default DefaultRoutes;