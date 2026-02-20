import type { ReactNode } from "react";

export interface ModalProps {
    children: ReactNode;
};

export interface ModalContextType {
    openId: string |null,
    setOpen: (value:string|null) => void
}

export interface ModalTriggerProps {
    id: string | null
}