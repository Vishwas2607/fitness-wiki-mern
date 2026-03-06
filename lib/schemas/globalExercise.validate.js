import {z} from "zod";

export const exerciseSchema = z.object({
    title: z.string().trim().min(3, "Title is required"),
    howToPerform: z.string().trim().min(10, "Atleast 1 Step is required"),
    image: z.string().trim().min(5, "Image Link is required"),

    primaryMuscles: z.string().trim().min(1, "Atleast 1 targeted body part name is required"),
    secondaryMuscles: z.string().trim().or(z.literal("")).optional(),
    movementPattern: z.enum(["push", "pull", "hinge", "squat", "lunge", "carry", "rotation","isometric"]).optional(),
    bodyWeight: z.boolean().optional(),

    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    equipment: z.string().trim().min(3).or(z.literal("")).optional(),

    trainingType: z.enum(["strength", "cardio","mobility"],{
        message: "Training Type is required and must be a valid type",
    }),

    exerciseCategory: z.enum(["compound", "isolation", "cardio", "core"], {
        message: "Exercise Category is required and must be a valid type",
    }),
    youtubeLink: z.string().url().or(z.literal("")).optional()
})


export const getAllExerciseQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(10).max(10).default(10),
})