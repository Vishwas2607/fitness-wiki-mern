import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query"
import useApiMainCalls from "../services/apiMainCalls"
import { useState } from "react"
import type { AllExerciseTypes } from "../types/apiResponse.types";
import { ModalProvider } from "../modals/modalProvider";
import { ModalTrigger } from "../modals/modalTrigger";
import Modals from "../modals/modalDetails";
import { Link,useNavigate } from "react-router";
import { Delete } from "lucide-react";

export default function AllExercises() {
    const {callMainApi} = useApiMainCalls()
    const [pageNo, setPageNo] = useState(1);
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const {mutate,isPending} = useMutation({
        mutationFn: async(id:string) => await callMainApi<null, null>({link:`global-exercise/${id}`, method:"DELETE", data:null}),
        onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["all-exercises",pageNo] });
        },
        onSuccess: () => {
            console.log("Deleted successfully");
        },
        onError: (error) => {
            console.error("Mutation error:", error);
        }
    });


    const {data,isLoading,error} = useQuery({
        queryKey: ["all-exercises", pageNo],
        queryFn: async () => callMainApi<null,AllExerciseTypes>({link: `global-exercise?page=${pageNo}&limit=${10}`, method:"GET", data:null})
    });

    console.log(data)

    const handleDelete = (id:string) => {
        mutate(id)
    }

    return (
        <section className="section body-text">
            <div className="w-fit">
                <h2 className="text-3xl font-bold px-2 text-center">All Exercises</h2>
                <div className="border mb-5 mt-1 border-green-500"></div>
            </div>

            <div className="container-wrapper gap-6">
                {isLoading && <p>Loading...</p>}
                {!isLoading && error && <p className="error-msg" role="alert" aria-live="assertive">{error.message || "Something went wrong"}</p>}
                {!isLoading && !error && data && (<div className="flex flex-col gap-6">
                    <ModalProvider>
                        {data.allExercises.map((exer,index)=> (
                            <div className="card-details gap-6 relative" key={exer._id}>
                                <h4 className="card-title">Exercise {(pageNo - 1)*10 +index+1}: {exer.title}</h4>
                                    <ModalTrigger id={exer._id}/>
                                    <Modals _id={exer._id} title={exer.title} howToPerform={exer.howToPerform} image={exer.image} level={exer.level} primaryMuscles={exer.primaryMuscles} secondaryMuscles= {exer.secondaryMuscles} trainingType={exer.trainingType} equipment={exer.equipment} exerciseCategory={exer.exerciseCategory} />
                                     <button className="absolute top-2 right-2 -rotate-90 text-rose-500 disabled:btn-disabled" aria-label="delete-plan" onClick={()=>handleDelete(exer._id)} disabled={isPending}>{<Delete size={24}/>}</button>
                            </div>
                        ))}
                    </ModalProvider>
                        {data.totalPages > 1 && (
                            <div className="w-full flex justify-between items-center">
                                <button className="btn btn-primary disabled:btn-disabled" disabled={pageNo === 1} onClick={()=>setPageNo(prev=>prev-1)}>Prev</button>
                                <span>Page {pageNo} of {data.totalPages}</span>
                                <button className="btn btn-primary disabled:btn-disabled" disabled={pageNo === data.totalPages} onClick={()=>setPageNo(prev=>prev+1)}>Next</button>
                            </div>
                        )}
                </div>)}
            </div>

            <div className="flex w-full gap-6 justify-center items-center">
                <Link to="/my-plans" className="btn btn-secondary">View Plans</Link>
                <button className="btn btn-secondary" onClick={()=>navigate(-1)}>Go back</button>
            </div>
        </section>
    )
}