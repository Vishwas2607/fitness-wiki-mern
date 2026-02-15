import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form";
import type { LoginFormValues } from "../../types/form.types";
import { zodResolver } from "@hookform/resolvers/zod";
import {loginSchema} from "../../../../lib/schemas/auth.validator"
import useApiAuthCalls from "../../services/apiAuthCalls";
import type { LoginResponse } from "../../types/auth.types";
import { useAuthentication } from "../../context/AuthenticateContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [error,setError] = useState("");
    const {callAuthApi} = useApiAuthCalls();
    const {verifyAuth} = useAuthentication();
    const navigate = useNavigate();
    
    const {register, handleSubmit, formState: {errors, isSubmitting,isValid}} = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onChange"
    });

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        try {
            setError("");
            const result = await callAuthApi<LoginFormValues, LoginResponse>({link:"login", method:"POST",data:data});
            if (result?.message) {
                await verifyAuth();
                navigate("/dashboard");
                
            };
        } catch(err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    };

    return (
        <section className="section"> 
                <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden h-full main-border">
                    <div className="container-wrapper body-text h-full justify-center">
                        <h2 className="section-heading text-center">Enter Login Credentails</h2>
                        <form className="flex flex-col gap-6 md:text-lg px-5" onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-wrapper">
                                <label htmlFor="email">Email: </label>
                                <input id="email" placeholder="Enter email" className="input" {...register("email")}/>
                            </div>
                            {errors.email && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.email.message}</p>}

                            <div className="input-wrapper">
                            <label htmlFor="password">Password: </label>
                            <input type={showPassword ? "text" : "password"} id="password" placeholder="Enter password" className="input" {...register("password")}/>
                            </div>
                            {errors.password && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.password.message}</p>}

                            <div>
                                <label htmlFor="show-password" className="flex gap-5 items-center cursor-pointer">
                                <input type="checkbox" id="show-password" className="w-5 h-5" onChange={(e)=> setShowPassword(e.target.checked)}/>
                                Show Password:</label>
                            </div>

                            {error && <p className="text-rose-500 text-lg" role="alert" aria-live="polite">{error}</p>}
                            <button className="btn btn-primary w-50 self-center disabled:btn-disabled" type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? "Logging in..." : "Login"}</button>
                        </form>
                        <p className="text-center">Don't have an account? <Link to="/register" className="text-emerald-500 font-semibold hover:text-emerald-400 transition-all duration-300 ease-in-out">Sign Up</Link></p>
                    </div>

                    <div className="hidden md:flex w-full flex-col justify-center items-center px-6 gap-6">
                        <h2 className="title mt-6">Welcome Back</h2>
                        <div className="w-full flex justify-center items-center">
                            <img src="/biceps-curl.png" alt="Cross-Curl" className="w-fit h-100"/>
                        </div>
                    </div>
                </div>
        </section>
    )
};