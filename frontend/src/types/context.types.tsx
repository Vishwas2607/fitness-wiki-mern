import type { ReactNode } from "react";

export type AuthType = "loading" | "authenticated" | "unauthenticated"

export type AuthenticationDetailsType = {authenticated: AuthType, username: string, role:string}

export type AuthenticationContextType = {
    authenticatedStatus: AuthenticationDetailsType;
    markUnauthenticated: () => void;
    verifyAuth: () => Promise<void>;
};
