import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useApiMainCalls from "../services/apiMainCalls";
import type { RecommendedWorkoutResponseData } from "../types/apiResponse.types";

export default function WorkoutPreview() {
    const [searchParams] = useSearchParams();
    const {callMainApi} = useApiMainCalls();

    const level = searchParams.get('level') || "";
    const days = searchParams.get("days") || "";
    const title = searchParams.get("title") || "";
    const goal = searchParams.get("goal") || "";
    const equipment = searchParams.get("equipment") || "";

    const {data,isLoading,error} = useQuery({
        queryKey:["preview-plans", title,level,days],
        queryFn: async() => callMainApi<null, RecommendedWorkoutResponseData>({link: `workouts/recommended-plans?days=${days}&level=${level}&goal=${goal}&equipment=${equipment}`, method:"GET", data:null}),
        
    });

    return (
        <section className="section body-text">
            <div>
                <h2 className="text-3xl font-bold px-2 text-center">{title}</h2>
                <div className="border mb-5 mt-1 border-green-500"></div>
            </div>
            {isLoading && <p>Loading...</p>}
            {!isLoading && error && <p className="error-msg">{error.message}</p>}
                    
            {data?.workoutPlan.map((allExercises,days)=> (

                <div className="container-wrapper">
                    <h3 className="section-heading">Day: {days+1}</h3>
                    {allExercises.exercises.map((exer,index)=> (
                        <div key={exer.exerciseId} className="card">
                            <h4 className="card-title mb-6">Exercise: {index+1}: {exer.title}</h4>
                            <div className="flex gap-6 text-sm md:text-base">
                            <span>Sets: {exer.sets}</span>
                            <span>Reps:{exer.reps}</span>
                            <span>Rets: {exer.rest}</span>
                            </div>
                        </div>
                    ))}

                    {allExercises.cardio && (
                        <div className="card">
                            <h4 className="card-title mb-6">Cardio</h4>
                            <div className="flex gap-6 text-sm md:text-base">
                                <span>Type: {allExercises.cardio.type}</span>
                                <span>Duration: {allExercises.cardio.duration}</span>
                                </div>
                        </div>
                    )}
                </div>
            ))
            }

            {/* {data?.cardio?.map(car => 
                <div>

                </div>
            )} */}
            
        </section>
    )
}