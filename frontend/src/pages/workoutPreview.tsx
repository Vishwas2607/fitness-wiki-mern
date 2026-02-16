import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useApiMainCalls from "../services/apiMainCalls";
import type { RecommendedWorkoutResponseData, saveWorkoutPlan } from "../types/apiResponse.types";
import type { Goal, Level } from "../types/components.types";

export default function WorkoutPreview() {
    const [searchParams] = useSearchParams();
    const {callMainApi} = useApiMainCalls();

    const queryClient = useQueryClient();

    const mylevel = searchParams.get('level') || "beginner";
    const level: Level = mylevel as Level;

    const days = searchParams.get("days") || "";

    const title = searchParams.get("title") || "";

    const myGoal = searchParams.get("goal") || "fat_loss";

    const goal: Goal = myGoal as Goal; 
    const equipment = searchParams.get("equipment") || "";

    const {mutateAsync,isPending}= useMutation({
        mutationFn: async(data:saveWorkoutPlan) =>await callMainApi<saveWorkoutPlan, {message:string}>({link:"workouts/save-workout", method: "POST", data:data}),
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries({queryKey:["preview-plans", title,level,days],})
        },
        onError: (err) => console.error(err)
    })

    const {data,isLoading,error} = useQuery({
        queryKey:["preview-plans", title,level,days],
        queryFn: async() => await callMainApi<null, RecommendedWorkoutResponseData>({link: `workouts/workout-preview?days=${days}&level=${level}&goal=${goal}&equipment=${equipment}`, method:"GET", data:null}),
        
    });

    const plan = data?.workoutPlan.map(day=> {
        return { exercises: day.exercises.map(exer=> ({
                exerciseId: exer._id,
                sets: String(exer.sets),
                reps: exer.reps,
                restTime: exer.rest
            })),
             ...(day.cardio && {cardio: {cardioType: day.cardio.type, duration:day.cardio.duration}
            })
        }
    }) || []

    const workoutPlan: saveWorkoutPlan = {planName: title, goal: goal, level: level, plan:plan}

    const handleSavePlan = async (data:saveWorkoutPlan) => {
        try{
            mutateAsync(data)
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <section className="section body-text justify-center items-center">
            <div className="w-fit">
                <h2 className="text-3xl font-bold px-2 text-center">{title}</h2>
                <div className="border mb-5 mt-1 border-green-500"></div>
            </div>
            {isLoading && <p>Loading...</p>}
            {!isLoading && error && <p className="error-msg">{error.message}</p>}
                    
            {data?.workoutPlan.map((allExercises,days)=> (

                <div className="container-wrapper">
                    <h3 className="section-heading">Day: {days+1}</h3>
                    {allExercises.exercises.map((exer,index)=> (
                        <div key={exer._id} className="card">
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

            {data?.workoutPlan.length && <button className="btn btn-primary w-100 disabled:btn-disabled" disabled={isPending} onClick={()=> handleSavePlan(workoutPlan)}>{isPending ? "Saving Plan": "Save Plan"}</button>}
            
        </section>
    )
}