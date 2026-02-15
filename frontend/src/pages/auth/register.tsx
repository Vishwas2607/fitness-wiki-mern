import { useState } from "react"
import useApiAuthCalls from "../../services/apiAuthCalls";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { registerSchemaExtended, type RegisterFormValues, type RegisterPostDataType } from "../../types/form.types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterResponse } from "../../types/auth.types";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [error,setError] = useState("");
    const {callAuthApi} = useApiAuthCalls();
    const navigate = useNavigate();

    const {register,handleSubmit, formState:{errors,isSubmitting,isValid}} = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchemaExtended),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<RegisterFormValues> = async(data) => {
        try{
            setError("");
            const dataToPost = {username:data.username, email:data.email, password:data.password}
            const result = await callAuthApi<RegisterPostDataType, RegisterResponse >({link:"register",method:"POST", data: dataToPost});
            // callAuthApi will throw Error if any error happens
            if (result?.message) {
                navigate("/login", {replace:true})
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    }


    return (
        <section className="section">
            <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden h-full main-border">
                <div className="container-wrapper body-text h-full justify-center">
                <h2 className="section-heading text-center">Create an Account</h2>
                <form className="flex flex-col gap-6 md:text-lg px-5" onSubmit={handleSubmit(onSubmit)}>

                    <div className="input-wrapper">
                        <label htmlFor="username">Username: </label>
                        <input id="username" autoComplete="username" placeholder="Enter username" className="input" {...register("username")}/>
                    </div>
                    {errors.username && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.username.message}</p>}

                    <div className="input-wrapper">
                        <label htmlFor="email">Email: </label>
                        <input id="email" autoComplete="email" placeholder="Enter email" className="input" {...register("email")}/>
                    </div>
                    {errors.email && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.email.message}</p>}

                    <div className="input-wrapper">
                    <label htmlFor="password">Password: </label>
                    <input type={showPassword ? "text" : "password"} autoComplete="new-password" id="password" placeholder="Enter password" className="input" {...register("password")}/>
                    </div>
                    {errors.password && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.password.message}</p>}

                    <div className="input-wrapper">
                    <label htmlFor="cnf-password">Confirm Password: </label>
                    <input type={showPassword ? "text" : "password"} id="cnf-password" placeholder="Confirm password" className="input" {...register("confirmPassword")}/>
                    </div>
                    {errors.confirmPassword && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.confirmPassword.message}</p>}

                    <div className="flex gap-5 items-center">
                        <label htmlFor="show-password" className="flex gap-5 items-center cursor-pointer">
                        <input type="checkbox" id="show-password" className="w-5 h-5" onChange={(e)=> setShowPassword(e.target.checked)}/>
                        Show Password:</label>
                    </div>
                    {error && <p className="text-rose-500 text-lg" role="alert" aria-live="polite">{error}</p>}
                    <button className="btn btn-primary w-50 self-center disabled:btn-disabled" type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? "Registering..." : "Register"}</button>
                </form>
                <p className="text-center">Already have an account? <Link to="/login" className="text-sky-400 font-semibold hover:text-sky-600 transition-all duration-300 ease-in-out">Login</Link></p>
                </div>

                <div className="hidden md:flex w-full flex-col justify-center items-center px-6 ">
                    <h2 className="title text-center">Start Your Fitness Journey</h2>
                    <div>
                        <img src="stability-ball.png" alt="Stability-ball" aria-describedby="Men and women sitting on stability ball" className="w-fit h-100"/>
                    </div>
                </div>
            </div>
        </section>
    )
};