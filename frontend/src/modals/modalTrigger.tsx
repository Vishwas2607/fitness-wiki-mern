
import type { ModalTriggerProps } from "../types/modals.types";
import { useModalContext } from "./modalProvider";

export function ModalTrigger({id}: ModalTriggerProps) {
    const {setOpen} = useModalContext();

    return (
        <button onClick={()=> setOpen(id)} className="btn btn-primary w-fit px-4 py-2 md:px-6">
            View Details
        </button>
    )
}