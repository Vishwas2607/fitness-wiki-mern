import mongoose from "mongoose";

const globalExerciseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Exercise title is required"],
        trim: true
    },
    howToPerform:{
        type: [String],
        required: [true, "How to perform instruction is required"],
    },
    image:{
        type: String,
        required: [true, "Image Link is required"],
    },

    primaryMuscles: {
        type: [String],
        required: true
        },
    secondaryMuscles: {
        type: [String],
        default: []
        },
    movementPattern: {
        type: String,
        enum: ["push", "pull", "hinge", "squat", "lunge", "carry", "rotation","isometric"],
        },
    bodyWeight: {
        type: Boolean,
        default: true
    },
    level: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner"
        },
    equipment:{
        type: [String],
        default: ["none"]
    },
    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: true,
    },
    trainingType: {
        type: String,
        enum: ["strength", "cardio", "mobility"],
        required: true
        },
    exerciseCategory: {
        type: String,
        enum: ["compound", "isolation", "cardio", "core"],
        required: true
        },

    youtubeLink: String,
},
{
    timestamps: true
});

const GlobalExercise = mongoose.model("GlobalExercise", globalExerciseSchema);

export default GlobalExercise;




// I am making my second MERN Project Fitness planner, I want something like muscleWiki or fitness programmer like websites.

// I made admin based role for admins to add, delete, update, create exercises which is added in globalExercise model.

// using this model and user goals, and other factors like equipment, targeted muscles etc. I make a customized plan for them and also some common recommended plans which is also dynamically created by filtering global exercises.

// After exercises are fetched from global exercise I send user a preview if they like it then save to database therwise forget.

// I have written the code to generate recommended plans, I am not sure if it will work or not. But can you check it, as I am so confused and just changed the schema for better fetching.

// What do you think, How I can structure this , do you need any code files or models ?