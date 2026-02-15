import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticateContext";

export default function ProtectedRoute() {
    const {authenticatedStatus} = useAuthentication();

    if (authenticatedStatus.authenticated === "loading") {
        return <p>Loading.</p>
    }

    if (authenticatedStatus.authenticated === "unauthenticated"){ 
        return <Navigate to="/login" replace/>;
    }
    return <Outlet/>
}