import { useQuery } from "@tanstack/react-query";
import useApiMainCalls from "../services/apiMainCalls"
import type { SavedPlansResponse } from "../types/apiResponse.types";
import { useNavigate } from "react-router";

export default function SavedPlans() {
    const {callMainApi} = useApiMainCalls();
    const navigate = useNavigate();
    const {data,isLoading, error} = useQuery({
        queryKey: ["saved-plans"],
        queryFn: async () => await callMainApi<null,SavedPlansResponse >({link:"workouts/my-plans", method:"GET", data:null})
    });
    

    return (
        <section className="section body-text justify-center items-center">
            <div className="w-fit">
                <h2 className="text-3xl font-bold px-2 text-center">Saved Plans</h2>
                <div className="border mb-5 mt-1 border-green-500"></div>
            </div>
            <div className="container-wrapper">
                {isLoading && <p>Loading...</p>}
                {!isLoading && error && <p className="err-message" role="alert" aria-live="polite">{error.message ? error.message : "Something went wrong"}</p>}
                {!isLoading && !error && data && (<div className="w-full grid grid-cols-1 gap-6 lg:gap-3 md:grid-cols-2 lg:grid-cols-3 ">
                    {data.plans.map(p => (
                    <div className="card h-full gap-6 capitalize md:p-6 justify-between" key={p.planId}>
                        <h3 className="card-title">Plan Name: {p.name}</h3>
                        <div className="flex gap-6"><span>Goal: {p.goal.replace("_", " ")}</span><span></span>Level: {p.level}</div>
                        <button className="btn btn-primary w-fit" onClick={()=>navigate(`/my-plans/:${p.planId}`)}>View Plan Details</button>
                    </div>
                ))}
                </div>
                )}
            </div>
            <button className="btn btn-primary" onClick={()=> navigate(-1)}>Go Back</button>
        </section>
    )
};