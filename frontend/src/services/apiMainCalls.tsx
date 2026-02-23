import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../context/AuthenticateContext";
import type { ApiProps } from "../types/auth.types";

let isRefreshing: boolean = false;
let refreshPromise: Promise<boolean> | null = null;
let hasRedirected: boolean = false;

export default function useApiMainCalls() {
    const navigate = useNavigate();
    const {markUnauthenticated} = useAuthentication();
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    
    const logoutAndRedirect = () => {
        markUnauthenticated();
        navigate("/login")
    };

    const refreshAccessToken = async(): Promise<boolean> => {
        try{
            const response = await fetch(`${baseUrl}/api/auth/refresh-token`,{
                method:"POST",
                credentials: "include"
            });

            return response.ok
        } catch (err) {
            return false
        }
    }

    const callMainApi = async<T, R=any>({link, method="GET", data = null}: ApiProps<T>, retry= false): Promise<R> => {
        try{
            const url = `${baseUrl}/api/${link}`;

            const response = await fetch(url,{
                method:method,
                headers: data ? { "content-type": "application/json" } : undefined,
                credentials: "include",
                body: data ? JSON.stringify(data) : undefined
            });

            if(response.status === 401 && !retry) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    hasRedirected= false;
                    refreshPromise = refreshAccessToken().finally(() => {
                        isRefreshing = false;
                    });
                }

                const refreshed = await refreshPromise;

                refreshPromise = null

                if (!refreshed) {
                    if (!hasRedirected) { 
                        hasRedirected = true;
                        logoutAndRedirect();
                    }
                    throw new Error("Session Expired Please Login Again");
                };

                return callMainApi({link,method,data}, true);
            };

            if (response.status === 403) {
                logoutAndRedirect();
                throw new Error("Unauthorized");
            };

            if (!response.ok) {
                const errorData =await response.json();
                throw new Error(errorData.message || errorData.error || `Server Error: ${errorData.status}`)
            }

            return response.json();
        } catch (err) {
            console.error(err);
            if (err instanceof Error) throw err;
            throw new Error ("Internal Server Error")
        };
    }
    return {callMainApi};
}