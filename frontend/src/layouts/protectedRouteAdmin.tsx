import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticateContext";

export default function ProtectedRouteAdmin() {
    const {authenticatedStatus} = useAuthentication();

    if (authenticatedStatus.authenticated === "loading" || authenticatedStatus.authenticated === "unauthenticated") {
        return <Navigate to="/dashboard" replace />;
    }

    if (authenticatedStatus.role !== "admin"){ 
        return <Navigate to="/dashboard" replace/>;
    }
    return <Outlet/>
}