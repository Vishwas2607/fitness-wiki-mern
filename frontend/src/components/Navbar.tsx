import { NavLink } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticateContext";
import useApiAuthCalls from "../services/apiAuthCalls";

export default function Navbar() {
    const {authenticatedStatus} = useAuthentication();
    const {logout} = useApiAuthCalls();

    const handleClick = async() => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="body-text flex justify-center items-center gap-6">
            <NavLink to={"/"} className={({isActive})=> isActive ? "active-link" : "link"}>Home</NavLink>
            <NavLink to={"/dashboard"} className={({isActive})=> isActive ? "active-link" : "link"}>Dashboard</NavLink>
            {authenticatedStatus.authenticated !== "authenticated" &&(
            <>
            <NavLink to={"/login"} className={({isActive})=> isActive ? "active-link" : "link"}>Login</NavLink>
            <NavLink to={"/register"} className={({isActive})=> isActive ? "active-link" : "link"}>Register</NavLink>
            </>
            )}
            {authenticatedStatus.authenticated === "authenticated" && (
                <>
                <NavLink to={"/my-plans"} className={({isActive})=> isActive ? "active-link" : "link"}>My Plans</NavLink>
                <button className="btn btn-danger py-1" onClick={handleClick}>Logout</button>
                </>
            )}
        </nav>
    )
}