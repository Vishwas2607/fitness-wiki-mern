import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticateContext";
import type { ApiProps } from "../types/auth.types";

export default function useApiAuthCalls() {
    const navigate = useNavigate();
    const {markUnauthenticated} = useAuthentication();
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    
    const logout = async() => {
            const res = await fetch(`${baseUrl}/api/auth/logout`,{
                method: "POST",
                credentials: "include"
            });
            if(!res.ok) throw new Error("Logout Failed");

            markUnauthenticated();
            navigate("/login")
        };

        const callAuthApi = async<T, R=any>({link,method="POST", data=null}: ApiProps<T>): Promise<R> => {
            const url = `${baseUrl}/api/auth/${link}`;

            const response = await fetch(url,{
                method: method,
                headers: data ? {"content-type": "application/json"}: undefined,
                credentials: "include",
                body: data ? JSON.stringify(data) : undefined
            });

            if(!response.ok) {
                let errorData;
                try {
                errorData = await response.json()
                } catch {}

                throw new Error(errorData.message || errorData.error || `Server Error ${response.status}`);
            };

            return response.json();
        }
    return {callAuthApi,logout};
}