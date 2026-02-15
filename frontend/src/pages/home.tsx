import { Dumbbell, Activity, Weight} from "lucide-react"
import { useAuthentication } from "../context/AuthenticateContext"
import { useNavigate } from "react-router-dom";


export default function Home() {

    const {authenticatedStatus} = useAuthentication();
    const navigate = useNavigate();

    const handleClick = () => {
        if(authenticatedStatus.authenticated === "authenticated") return navigate("/dashboard");

        return navigate("/login")
    }

    return (
        <section className="section">
                <div className="hero container-wrapper">
                    <div className="flex flex-col justify-start items-start gap-6">
                        <h2 className="title">Online Fitness Planner</h2>
                        <p className="body-text">Achieve your <strong>Dream Physique</strong> with our recommended workout plans or customize your own workout plan with our help.</p>
                        <button className="btn btn-primary" onClick={handleClick}>Start Today</button>
                    </div>
                    <div className="flex justify-center items-center">
                        <img src="/pngwing.com (1).png" alt="Body-Flexing" className="w-60 h-60 lg:w-100 lg:h-80 " loading="lazy"/>
                    </div>
                </div>

                <div className="body-text container-wrapper">
                    <h3 className="section-heading"> WHAT IS WORKOUT PLANNER?</h3>
                    <p className="body-text">The workout planner is a web-based app that allows you to create a custom workout plan based on the equipment you have and your personal preference.
                        If you think creating your own workout plan is too hard, we’re here to tell you it’s not. We’ll help you create a custom workout plan step-by-step!</p>

                    <div className="grid-system mb-6 mt-6">
                        <div className="flex flex-col gap-6">
                            <div className="card">
                                <h4 className="card-title">LEARN HOW TO DO EXERCISES</h4>
                                <p >Not sure about an exercise? The exercise library offers resources to guide you on proper form and technique.</p>
                            </div>
                            <div className="card">
                                <h4 className="card-title">CREATE A FREE PERSONALIZED WORKOUT</h4>
                                <p>Build a workout plan that fits your goals and preferences. Easily add or remove exercises to create a workout designed specifically by and for you. It's completely free!</p>
                            </div>
                            <div className="card">
                                <h4 className="card-title">CREATE CUSTOM WORKOUTS FOR YOUR STUDENTS</h4>
                                <p>Design free custom workout plans for your students. Tailor each educational plan to your student's needs and goals.</p>
                            </div>
                            <div className="card">
                                <h4 className="card-title">FITNESS CALCULATORS</h4>
                                <p>Track calories, calculate rep maxes, and monitor body composition – all within the app.</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-center items-center">
                        <img src="/pngwing.com.png" loading="lazy" alt="Training-Couple" className="w-80 lg:w-80 h-150"/>
                        </div>
                    </div>
                </div>

                <div className="container-wrapper mb-6">
                    <div className="flex justify-center items-center flex-col gap-6 text-center">
                        <h3 className="section-heading">Create Your Workout And Share It With The World!</h3>
                        <p className="body-text">From sets, reps, tempo, and rest times, you have complete control over how you want to write it and how you want to present it.</p>
                        <button className="btn btn-primary" onClick={handleClick}>Get Started</button>
                    </div>
                    <div className="flex gap-6 justify-center items-center mb-6">
                        <div className="icons-card"><Dumbbell size={50}/> <p>Strength Training</p></div>
                        <div className="icons-card"><Weight size={50}/><p>Weight Loss</p></div>
                        <div className="icons-card"><Activity size={50}/><p>Cardio</p></div> 
                    </div>
                </div>

                <div className="container-wrapper body-text">
                    <h3 className="section-heading">How to Create a Personalized Workout Plan</h3>
                    <p>One of the most important things to consider when creating your custom workout plan is what you want to achieve.</p>
                    <ul>
                        <li>Do you want to build muscle?</li>
                        <li>Are you looking to lose weight?</li>
                        <li>Do you want to become stronger?</li>
                        <li>Do you desire to increase your endurance?</li>
                        <li>Do you want to focus on a specific body part or muscle group?</li>
                    </ul>
                    <p>Of course, the end goal is to lose weight or gain muscle mass and to have a healthier and fitter body. However, you cannot achieve this goal overnight. This is why you need a fitness planner. Target your muscles, choose exercises and create your workout!</p>
                </div>
        </section>
    )
}



