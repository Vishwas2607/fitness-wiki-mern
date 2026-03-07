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
