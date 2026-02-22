import { NavLink } from "react-router-dom";
import { HomeIcon, LayoutDashboard, LucideLogIn, UserPlus, ClipboardList, Dumbbell } from "lucide-react";
import { useAuthentication } from "../context/AuthenticateContext";
import useApiAuthCalls from "../services/apiAuthCalls";

export default function Sidebar() {
    const {authenticatedStatus} = useAuthentication();
    const {logout} = useApiAuthCalls();

    const handleClick = async() => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    }; 

    return(
        <nav className="sidebar">
            <NavLink to={"/"} className={({isActive})=> isActive ? "active-sidebar-link": "sidebar-link" }><HomeIcon/>Home</NavLink>
            <NavLink to={"/dashboard"} className={({isActive})=> isActive ? "active-sidebar-link": "sidebar-link"}> <LayoutDashboard/>Dashboard</NavLink>
            {authenticatedStatus.authenticated !== "authenticated" && (
                <>
                    <NavLink to={"/login"} className={({isActive})=> isActive ? "active-sidebar-link": "sidebar-link"}><LucideLogIn/>Login</NavLink>
                    <NavLink to={"/register"} className={({isActive})=> isActive ? "active-sidebar-link": "sidebar-link"}><UserPlus/>Register</NavLink>
                </>
            )}
            {authenticatedStatus.authenticated === "authenticated" && (
                <>
                <NavLink to={"/my-plans"} className={({isActive})=> isActive ? "active-sidebar-link": "sidebar-link"}><ClipboardList/>My-plans</NavLink>
                {authenticatedStatus.role === "admin" && (
                    <>
                        <NavLink to={"/global-exercise"} className={({isActive})=> isActive ? "active-sidebar-link": "sidebar-link"}><Dumbbell/>All Exercises</NavLink>
                    </>
                )} 
                
                <div className="w-full flex justify-center items-center">
                    <button className="btn btn-danger" onClick={handleClick}>Logout</button>
                </div>
                </>
            )}
        </nav>
    )
}