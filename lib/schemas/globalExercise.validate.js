import {z} from "zod";

export const exerciseSchema = z.object({
    title: z.string().trim().min(3, "Title is required"),
    howToPerform: z.string().trim().min(10, "Atleast 1 Step is required"),
    image: z.string().trim().min(5, "Image Link is required"),

    primaryMuscles: z.string().trim().min(1, "Atleast 1 targeted body part name is required"),
    secondaryMuscles: z.string().trim().optional(),
    movementPattern: z.enum(["push", "pull", "hinge", "squat", "lunge", "carry", "rotation","isometric"]).optional(),
    bodyWeight: z.boolean().optional(),

    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    equipment: z.string().trim().min(3).optional(),

    trainingType: z.enum(["strength", "cardio","mobility"],{
        required_error: "Please select a training type"
    }),
    exerciseCategory: z.enum(["compound", "isolation", "cardio", "core"], {
        required_error: "Please select a exercise category"
    }),
    youtubeLink: z.string().url().optional()
})

