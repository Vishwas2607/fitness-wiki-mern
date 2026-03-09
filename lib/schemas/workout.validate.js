import {z} from "zod";

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")

export const savePlanSchema = z.object({
    planName: z.string().trim().min(1, "Plan name is required"),

    goal: z.enum(["fat_loss", "muscle_gain", "endurance", "strength"]).optional(),
    userLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    plan: z.array(
            z.object({
                exercises: z.array(
                    z.object({
                        exerciseId: objectId,

                        sets: z.string().min(1).optional(),

                        reps: z.string().min(1).optional(),

                        restTime: z.string().min(1).optional(),
                    })
                ),
                cardio: z.object({cardioType: z.string().optional(), duration: z.string().optional()}).optional()  //Made type and duration optional too, so avoid any validation error if cardio field is empty.
            })
        ).min(1, "At least one exercise is required"),
    });

export const getWorkoutPreviewSchema = z.object({
    days: z.coerce.number(),
    primaryMuscles: z.string().trim().toLowerCase().optional(),
    bodyWeight: z.coerce.boolean().default(true),
    equipment:z.string().trim().toLowerCase().optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    goal: z.enum(["fat_loss", "muscle_gain", "endurance", "strength"]).default("fat_loss")
})

export const getMySpecificPlanQuery = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(1).default(1)
})

export const customWorkoutPreviewSchema = z.object({
    planName: z.string().min(3, "Plan Name is required"),
    days: z.number().min(1).max(7),
    primaryMuscles: z.string().min(3, "Primary Muscles is required or use none"),
    bodyWeight: z.boolean(),
    equipment:z.string().min(3, "Equipment is required or use none"),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    goal: z.enum(["fat_loss", "muscle_gain", "endurance", "strength"])
})