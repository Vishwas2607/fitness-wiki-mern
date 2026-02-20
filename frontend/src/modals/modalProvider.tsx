import { createContext, useContext, useState } from "react";
import type { ModalContextType, ModalProps } from "../types/modals.types";
import { useEffect } from "react";

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({children}: ModalProps) {
    const [openId,onOpenChange] = useState<string | null>(null);
    useEffect(() => {
        if (openId !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        }, [openId]);

    return (
        <ModalContext.Provider value={{openId,setOpen:onOpenChange}}>
            {children}
        </ModalContext.Provider>
    )
};

export function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Modal components must be inside <ModalProvider>");
  return ctx;
}