import { NavLink } from "react-router-dom";
import { HomeIcon, LayoutDashboard, LucideLogIn, UserPlus, ClipboardList, Dumbbell, PlusIcon } from "lucide-react";
import { useAuthentication } from "../context/AuthenticateContext";
import useApiAuthCalls from "../services/apiAuthCalls";
import { Squash as Hamburger } from 'hamburger-react';

export default function Sidebar({isOpen, setOpen}: {isOpen:boolean; setOpen: (isOpen:boolean)=> void}) {
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
            <div className='flex w-full justify-end'>
                <Hamburger toggled={isOpen} toggle={()=>setOpen(!isOpen)} color={"white"} size={20}/>
            </div>

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
                        <NavLink to={"/global-exercise/add-exercise"} className={({isActive})=> isActive ? "active-sidebar-link": "sidebar-link"}><PlusIcon/>Add Exercises</NavLink>
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