import clsx from "clsx";
import type { CardsType } from "../types/components.types";
import { useNavigate } from "react-router-dom";

export default function Cards({details}: {details: CardsType}) {
    const navigate = useNavigate();

    const cls = clsx(
        "text-[12px] md:text-[16px] text-green-400 border rounded-lg px-1 text-center capitalize",
        {
            
            "text-yellow-400": details.level === "intermediate",
            "text-red-400": details.level === "advanced"
        }
    )

    const query = `title=${details.title}&days=${details.days}&level=${details.level}&goal=${details.goal}&equipment=${details.equipment}`;

    const handleClick = () => {
        navigate(`/preview-plans?${query}`)
    };

    return(
    <div className="card w-full h-full body-text" onClick={handleClick}>
        <img src={`/${details.url}.jpg`} alt="Weight Loss" className="rounded-2xl w-full aspect-video"/>
        <div className="flex flex-col justify-center gap-2 md:gap-4 px-2">
            <span className="card-title mt-2">{details.title}</span>
            <div className="flex justify-between items-center">
                <span className={cls}>{details.level}</span>
                <span className="border rounded-lg px-2 capitalize text-[12px] text-center md:text-[16px]">{details.type}</span>
            </div>
        </div>
    </div>
    )
}