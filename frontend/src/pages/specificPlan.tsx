import { useQuery } from "@tanstack/react-query";
import useApiMainCalls from "../services/apiMainCalls";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import { Link } from "react-router";
import type { MySpecificPlanResponse } from "../types/apiResponse.types";

export default function SpecificPlan() {
    const params = useParams();

    const {callMainApi} = useApiMainCalls();
    const [pageNo,setPageNo] = useState(1);
    const navigate = useNavigate();

    const {data,isLoading,error} = useQuery({
        queryKey: ["saved-plans", params?.planId ,pageNo],
        queryFn: async() => await callMainApi<null, MySpecificPlanResponse>({link:`workouts/my-plans/${params.planId}?page=${pageNo}&limit=1`, method:"GET", data: null})
    });
    console.log(data)
    return (
        <section className="section body-text">

            <div className="w-fit">
                <h2 className="text-xl md:text-3xl font-bold px-2 text-center">{data?.plan.name ? data.plan.name : "Your saved Plan"}</h2>
                <div className="border mb-5 mt-1 border-green-500"></div>
            </div>

            <div className="container-wrapper capitalize">
                {isLoading && <p>Loading...</p>}
                {!isLoading && error && <p className="error-msg">{error.message ? error.message : "Something went Wrong"}</p>}
                {!isLoading && !error && data && (
                    
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-6">
                            <h3 className="section-heading text-center">Day {pageNo} Plan</h3>
                            <div className="flex gap-6 card-title"><span>Goal: {data.plan.goal.replace("_", " ")}</span><span>Total Days: {data.plan.totalDays}</span></div>
                        </div>
                        
                        {data.plan.dayData[0].exercises.map((exer,index) => (
                            <div className="card gap-6">
                                <h4 className="card-title">Exeercise {index+1}: {exer.exerciseId.title}</h4>
                                <div className="flex gap-3 md:gap-6 text-sm md:text-base">
                                    <span>Sets: {exer.sets}</span>
                                    <span>Reps: {exer.reps}</span>
                                    <span>RestTime: {exer.restTime}</span>
                                </div>
                                <button className="btn btn-primary w-fit">View Full Details</button>
                            </div>
                        ))}

                        {data.plan.totalDays > 1 && (
                            <div className="w-full flex justify-between items-center">
                                <button className="btn btn-primary disabled:btn-disabled" disabled={pageNo === 1} onClick={()=>setPageNo(prev=>prev-1)}>Prev</button>
                                <button className="btn btn-primary disabled:btn-disabled" disabled={pageNo === data.plan.totalDays} onClick={()=>setPageNo(prev=>prev+1)}>Next</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="flex w-full gap-6 justify-center items-center">
                <Link to="/my-plans" className="btn btn-secondary">View Plans</Link>
                <button className="btn btn-secondary" onClick={()=>navigate(-1)}>Go back</button>
            </div>
        </section>
    )

}