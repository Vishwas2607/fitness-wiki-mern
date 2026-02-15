import { Link } from "react-router";

export default function Footer() {
    return (
        <div className="flex flex-col justify-center items-center p-5 gap-10 md:flex-row">
            <div className="flex flex-col gap-2 w-full">
                <h3 className="text-lg font-semibold">Workout Planner Web</h3>
                <p>Online workout planner lets you create free personalized workout plans to help you reach your fitness goals.</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <h3 className="text-lg font-semibold">About Us</h3>
                <p>We are your personal trainer, your nutritionist, your supplement expert. Our aim is to make sports enjoyable for a healthy life.</p>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <h3 className="text-lg font-semibold">Contacts</h3>
                <span className="w-full border"></span>
                <p >For any queries or suggestions email us at:</p>
                <Link to={"mailto:vishwashverma1234@gmail.com"} className="text-emerald-400 hover:text-emerald-500 transition duration-300 ease-in-out">mail@FitnessWiki.com</Link>
            </div>
        </div>
    )
}