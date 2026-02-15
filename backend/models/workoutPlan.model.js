import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type:String,
        required: [true, "Name is required"],
    },
    goal: {
        type: String,
        enum: ["fat_loss", "muscle_gain", "endurance", "flexibility"],
        default: "fat_loss"
    },
    userLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"]
        },
        
    days: [
    {
        day: {
        type: String,
        required: true
        },
        focus: String,
        exercises: [
        {
            exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GlobalExercise",
            required: true
            },
            sets: Number,
            reps: Number,
            duration: Number,
            restTime: Number,
            order: Number
        }
        ]
    }
    ]

    },
    {timestamps: true}
)

workoutPlanSchema.index({ user: 1, name: 1 }, { unique: true });

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
export default WorkoutPlan;