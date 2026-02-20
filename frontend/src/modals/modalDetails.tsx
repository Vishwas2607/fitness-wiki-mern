import clsx from "clsx";
import type { ModalProps } from "../types/components.types";
import { useModalContext } from "./modalProvider";
import { XIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Modals({_id,title,howToPerform,image,primaryMuscles,secondaryMuscles,level,equipment, trainingType,exerciseCategory}: ModalProps) {
    const {openId,setOpen} = useModalContext();
    const isOpen = openId === _id;

    const modalRef = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        if (!isOpen) return;
        
        modalRef.current?.focus()

        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(null);
        }

        if (e.key === "Tab" && modalRef.current) {
            const focusableSelectors = [
                'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
                'input:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'
                ];

            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelectors.join(','));
            const elements = Array.from(focusableElements);
            if (elements.length === 0) return;

            const firstEl = elements[0];
            const lastEl = elements[elements.length-1];
            const active = document.activeElement;

            if(e.shiftKey) {
                if (active === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (active === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            };
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return ()=> window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen,setOpen]);

    const cls = clsx(
        " body-text fixed inset-0 p-6 w-screen h-screen z-50 modals justify-center items-center flex-col",
        {"flex": isOpen,
            "hidden": !isOpen
        }
    );

    if (!isOpen) return null;

    return (
        <div className={cls}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="Modal-Box"
            aria-describedby="Modal-box container"
            onClick={(e)=>e.stopPropagation()}
            >
            <div className=" mt-6 md:mt-0 flex flex-col gap-6 bg-slate-900/90 p-6 max-h-[90vh] overflow-y-auto rounded-lg">
                <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-[50%_50%] gap-6">
                    <div className="w-full h-full p-6 bg-slate-950/80">
                        <img src={image} alt={`${title}'s image`} className="w-full h-full aspect-video" />
                    </div>
                    <div className="flex flex-col gap-6">
                        <h3 className="section-heading">How To Perform:</h3>
                        {howToPerform.map((step,index)=> (
                            <p key={`step-${index+1}`}>Step {index+1}: {step}</p>
                        ))}
                    </div>
                </div>
                <div>

                    <div className="flex gap-6 flex-col md:flex-row">
                        <p><span className="font-semibold">Primary Muscles:</span> {primaryMuscles.map((p,i)=>(
                            <span key={`Primary-muscles-${i+1}`}>{p}{i < primaryMuscles.length - 1 ? ', ' : ''}</span>
                        ))}
                        </p>

                        <p><span className="font-semibold">Secondary Muscles:</span> {secondaryMuscles.map((p,i)=>(
                            <span key={`Secondary-muscles-${i+1}`}>{p}{i < secondaryMuscles.length - 1 ? ', ' : ''}</span>
                        ))}
                        </p>
                    </div>
                    <div className="flex gap-6 flex-col md:flex-row">
                        <span><span className="font-semibold">Level:</span> {level}</span>
                        <span><span className="font-semibold">Training Type:</span> {trainingType}</span>
                        <span><span className="font-semibold">Exercise Category:</span> {exerciseCategory}</span>
                    </div>
                    <div className="flex gap-6 flex-col md:flex-row">
                        <p><span className="font-semibold">Equipments:</span> {equipment.map((e,i)=> (
                            <span key={`Equipment-${i}`}>{e}{i < primaryMuscles.length - 1 ? ', ' : ''}</span>
                        ))}</p>
                    </div>
                </div>
            </div>
            <button className="btn btn-ghost fixed top-3 right-0 " aria-label="Close-modal" onClick={()=>setOpen(null)}>{<XIcon/>}</button>
        </div>
    )
}