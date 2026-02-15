import { createContext, useCallback, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { AuthenticationContextType, AuthenticationDetailsType } from "../types/context.types";
import type { AuthCheckResponse } from "../types/apiResponse.types";

const AuthenticationContext = createContext<AuthenticationContextType |null>(null);

export function AuthenticationProvider({children}: {children:ReactNode}) {

    const [authenticatedStatus, setAuthenticated] = useState<AuthenticationDetailsType>({authenticated:"loading", username: "Guest", role:"user"});

    const verifyAuth = useCallback( async () => {
        try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${baseUrl}/api/me`, {
            credentials: "include",
        });

        if (!response.ok) {
            setAuthenticated({authenticated: "unauthenticated", username:"Guest", role:"user"});
            return;
        }

        const data: AuthCheckResponse = await response.json();
        setAuthenticated({authenticated: data.authenticated ? "authenticated" : "unauthenticated", username: data.username, role:data.role});
        } catch {
        setAuthenticated({authenticated: "unauthenticated", username:"Guest", role:"user"});
        }
    },[]);

    const markUnauthenticated = () => {
        setAuthenticated({authenticated: "unauthenticated", username:"Guest", role:"user"});
    };

    useEffect(()=> {
        verifyAuth();
    },[]);

    return <AuthenticationContext.Provider value={{authenticatedStatus,markUnauthenticated,verifyAuth}} >
        {children}
    </AuthenticationContext.Provider>
};

export function useAuthentication () {
    const context = useContext(AuthenticationContext);

    if(!context) throw new Error("useAuthentication must be used inside <AuthenticationProvider>");
    
    return context;
}