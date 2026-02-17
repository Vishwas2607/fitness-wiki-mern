import { PlusIcon } from "lucide-react";
import type { CardsType } from "../types/components.types";
import Cards from "../components/Cards";
import { useAuthentication } from "../context/AuthenticateContext";

export default function Dashboard() {
    const {authenticatedStatus} = useAuthentication();

    const recommendedPlans:CardsType[] = [{title: "Weight Loss", level:"beginner", url:"weight_loss", type:"weight_loss", days:"4",goal:"fat_loss",equipment:"none"}, {title: "Strength Training", level:"advanced", url:"strength_training", type:"strength", days:"6",goal:"muscle_gain",equipment:"dumbbell, barbell, machine, pull-up bar,cable machine, bar, dumbbells, kettlebell, lat pulldown machine, seated cable row"}, {title: "Cardio", level:"intermediate", url:"cardio", type:"cardio",days:"3", goal:"fat_loss",equipment:"none"}, {title: "Stretching", level:"beginner", url:"stretching",type:"stretching", days: "4",goal:"muscle_gain",equipment:"none"}]

    return(
        <section className="section justify-center items-center body-text">
            <div className="flex flex-col text-center w-fit">
                <h2 className="text-xl md:text-3xl font-bold px-2 text-center">Dashboard</h2>
                <div className="border mb-5 mt-1 border-emerald-400"></div>
            </div>
            <div className="w-full px-6">
                <p className="section-heading text-left capitalize">Hii, {authenticatedStatus.username}</p>
            </div>
            <div className="container-wrapper">
                <div className="flex flex-col justify-start w-full px-2">
                <h3 className="section-heading">Recommended Plans</h3>
                <div className="border mb-6 mt-1 border-emerald-500 w-60"></div>
                </div>

                <div className=" grid grid-cols-2 lg:grid-cols-4 place-content-center place-items-center gap-6">

                {recommendedPlans.map(plan => (
                    <div className="w-full h-full" key={plan.title}>
                    <Cards details={plan}/>
                    </div>
                ))}

                </div>
            </div>

            <button className="btn btn-primary">Create your own Workout Plan <PlusIcon size={25}/></button>

        </section>
    )
}