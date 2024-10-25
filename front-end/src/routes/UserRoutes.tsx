import { Route, Routes } from "react-router-dom";
import ProtectedUserRoute from "../components/route/ProtectedUserRoute";
import Dashboard from "../pages/user/Dashboard";
import Item from "../pages/user/Item";
import NotFound from "../pages/error/NotFound";
import Stock from "../pages/user/Stock";

const UserRoutes = () => {

    return (
        <Routes>
            <Route element={<ProtectedUserRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/item" element={<Item />} />
                <Route path="/stock" element={<Stock />} />

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes;