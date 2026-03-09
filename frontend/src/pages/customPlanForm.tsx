import { useForm, type SubmitHandler } from "react-hook-form"
import { type CustomWorkoutFormValues } from "../types/form.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { customWorkoutPreviewSchema } from "../../../lib/schemas/workout.validate"
import { useNavigate } from "react-router"

export default function CustomPlanForm() {
    const navigate = useNavigate();

    const {register,reset,handleSubmit,formState:{errors, isSubmitting,isValid}} = useForm<CustomWorkoutFormValues>({
        resolver: zodResolver(customWorkoutPreviewSchema),
        mode: "onChange",
        defaultValues: {
        primaryMuscles: "none",
        equipment: "none",
        bodyWeight: true,
        level: "beginner",
        goal: "fat_loss"
    }
    })

    const onSubmit: SubmitHandler<CustomWorkoutFormValues> = (data) => {
        const params = new URLSearchParams({
        title: data.planName,
        days: String(data.days),
        level: data.level,
        goal: data.goal,
        equipment: data.equipment,
        bodyWeight: String(data.bodyWeight),
        });

        if (data.primaryMuscles !== "none") {
            params.append("primaryMuscles", data.primaryMuscles);
        }
        navigate(`/preview-plans?${params.toString()}`);
        reset();
    }

    return (
        <section className="section body-text justify-center items-center">
            
            <div className="container-wrapper w-[90%] ">
                <h2 className="text-3xl font-bold px-2 text-center">Custom Workout Details</h2>

                <form className="flex flex-col gap-6 md:text-lg px-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-wrapper">
                        <label htmlFor="planName">Plan Name:</label>
                        <input type="text" className="input" placeholder="Enter plan name" id="planName" {...register("planName")}/>
                    </div>
                    {errors.planName && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.planName.message}</p>}
                    
                    <div className="input-wrapper flex-row justify-start">
                        <label htmlFor="days">Days:</label>
                        <input type="number" className="input" max={7} min={1} id="days" placeholder="Enter days" {...register("days", {valueAsNumber:true})} />
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="primaryMuscles" className="w-45">Primary Muscles:</label>
                        <input type="text" className="input" id="primaryMuscles" placeholder="Enter primary muscles" {...register("primaryMuscles")} defaultValue={"none"}/>
                    </div>
                    {errors.primaryMuscles && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.primaryMuscles.message}</p>}

                    <div className="input-wrapper flex-row justify-start">
                        <label htmlFor="bodyWeight" className="mt-2">Body Weight:</label>
                        <input type="checkbox" className="w-5 h-10" defaultChecked id="bodyWeight" {...register("bodyWeight")}/>
                    </div>

                    <div className="input-wrapper justify-start">
                        <label htmlFor="level">Level:</label>
                        <select id="level" className="select" {...register("level")}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="equipment">Equipment:</label>
                        <input type="text" className="input" id="equipment" placeholder="Enter equipments separated by commas" {...register("equipment")} defaultValue={"none"}/>
                    </div>
                    {errors.equipment && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.equipment.message}</p>}

                    <div className="input-wrapper justify-start">
                        <label htmlFor="goal">Goal:</label>
                        <select id="goal" className="select" {...register("goal")}>
                            <option value="fat_loss">Fat Loss</option>
                            <option value="muscle_gain">Muscle Gain</option>
                            <option value="strength">Strength</option>
                            <option value="endurance">Endurance</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-50 self-center disabled:btn-disabled" disabled={!isValid || isSubmitting}>Create Plan</button>
                </form>
            </div>
        </section>
    )
}