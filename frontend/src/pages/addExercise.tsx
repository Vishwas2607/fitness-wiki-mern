import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useParams } from "react-router"
import {exerciseSchema} from "../../../lib/schemas/globalExercise.validate"
import type { ExerciseFormValues } from "../types/form.types";
import useApiMainCalls from "../services/apiMainCalls";
import { useState, useEffect } from "react";
import type { AddExerciseResponse, ExerciseId } from "../types/apiResponse.types";
import { useQuery } from "@tanstack/react-query";
import { convertToString } from "../utils/helpers";

export default function AddExercise(){
    const params = useParams();
    const [error, setError] = useState("");
    const {callMainApi} = useApiMainCalls();
    let isEditing = !!params.id ;
    console.log(isEditing)

    const {data} = useQuery({
        queryKey:["all-exercises", params.id],
        queryFn: async()=> await callMainApi<null, ExerciseId>({link:`global-exercise/${params.id}`, method:"GET", data:null}),
        enabled: isEditing,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true
    });

    const {register,reset, handleSubmit,formState:{errors,isSubmitting,isValid}} = useForm<ExerciseFormValues>({
        resolver: zodResolver(exerciseSchema),
        mode: "onChange",
    });

    const link = isEditing ? `global-exercise/${params.id}` : "global-exercise";
    const method = isEditing ? "PUT" : "POST"

    const onSubmit: SubmitHandler<ExerciseFormValues> = async(data) => {
        try{
            
            const result = await callMainApi<ExerciseFormValues, AddExerciseResponse>({link:link, method:method, data: data})
            console.log(result.message)
            reset()
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Something went wrong")
        }
    }
    useEffect(() => {
        if (data) {
            console.log(data)
            const formattedData = {
            ...data,
            howToPerform: convertToString(data.howToPerform),
            primaryMuscles: convertToString(data.primaryMuscles),
            secondaryMuscles: convertToString(data.secondaryMuscles),
            equipment: convertToString(data.equipment)
        };
        console.log(formattedData)
        reset(formattedData as ExerciseFormValues)
        }
    }, [data, reset]);

    return (
        <section className="section body-text justify-center items-center">

            <div className="container-wrapper w-[90%] ">
                <h2 className="text-3xl font-bold px-2 text-center">{isEditing ? "Edit Exercise": "Add Exercise"}</h2>

                <form className="flex flex-col gap-6 md:text-lg px-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-wrapper">
                        <label htmlFor="title">Title:</label>
                        <input type="text" className="input" id="title" placeholder="Enter title" {...register("title")}/>
                    </div>
                    {errors.title && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.title.message}</p>}

                    <div className="input-wrapper">
                        <label htmlFor="howToPerform" className="w-45">How To Perform:</label>
                        <input type="text" className="input" id="howToPerform" placeholder="Enter how to perform seperated by commas" {...register("howToPerform")}/>
                    </div>
                    {errors.howToPerform && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.howToPerform.message}</p>}

                    <div className="input-wrapper">
                        <label htmlFor="image" className="w-30">Image Link:</label>
                        <input type="text" className="input" id="image" placeholder="Enter image link" {...register("image")}/>
                    </div>
                    {errors.image && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.image.message}</p>}

                    <div className="input-wrapper">
                        <label htmlFor="primaryMuscles" className="w-45">Primary Muscles:</label>
                        <input type="text" className="input" id="primaryMuscles" placeholder="Enter primary muscles" {...register("primaryMuscles")}/>
                    </div>
                    {errors.primaryMuscles && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.primaryMuscles.message}</p>}

                    <div className="input-wrapper">
                        <label htmlFor="secondaryMuscles" className="w-55">Seconday Muscles:</label>
                        <input type="text" className="input" id="secondaryMuscles" placeholder="Enter secondary muscles" {...register("secondaryMuscles")}/>
                    </div>
                    {errors.secondaryMuscles && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.secondaryMuscles.message}</p>}

                    <div className="input-wrapper justify-start">
                        <label htmlFor="movementPattern">Movement Pattern:</label>
                        <select id="movementPattern" className="select" {...register("movementPattern")}>
                            <option value="push">Push</option>
                            <option value="pull">Pull</option>
                            <option value="hinge">Hinge</option>
                            <option value="squat">Squat</option>
                            <option value="lunge">Lunge</option>
                            <option value="carry">Carry</option>
                            <option value="rotation">Rotation</option>
                            <option value="isometric">Isometric</option>
                        </select>
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
                        <input type="text" className="input" id="equipment" placeholder="Enter equipments separated by commas" {...register("equipment")}/>
                    </div>
                    {errors.equipment && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.equipment.message}</p>}

                    <div className="input-wrapper justify-start">
                        <label htmlFor="trainingType">Training Type:</label>
                        <select id="trainingType" className="select" {...register("trainingType")}>
                            <option value="strength">Strength</option>
                            <option value="cardio">Cardio</option>
                            <option value="mobility">Mobility</option>
                        </select>
                    </div>

                    <div className="input-wrapper justify-start">
                        <label htmlFor="exerciseCategory">Exercise Category:</label>
                        <select id="exerciseCategory" className="select" {...register("exerciseCategory")}>
                            <option value="compound">Compound</option>
                            <option value="isolation">Isolation</option>
                            <option value="cardio">Cardio</option>
                            <option value="core">Core</option>
                        </select>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="youtubeLink">Youtube Link:</label>
                        <input type="text" className="input" id="youtubeLink" placeholder="Enter youtube link" {...register("youtubeLink")}/>
                    </div>
                    {errors.youtubeLink && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{errors.youtubeLink.message}</p>}
                    {error && <p role="alert" aria-live="polite" className="text-red-500 md:text-lg">{error}</p>}
                    <button type="submit" className="btn btn-primary w-50 self-center disabled:btn-disabled" disabled={!isValid || isSubmitting}>{isEditing? "Update Exercise": "Add Exercise"}</button>
                </form>
            </div>
        </section>
    )
}