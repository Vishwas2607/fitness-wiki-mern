import {z} from "zod";

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")

export const savePlanSchema = z.object({
    planName: z.string().trim().min(1, "Plan name is required"),

    goal: z.enum(["fat_loss", "muscle_gain", "endurance", "flexibility"]).optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
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
    type: z.enum(["strength", "cardio", "mobility"]).optional(),
    days: z.coerce.number(),
    primaryMuscles: z.string().optional(),
    bodyWeight: z.coerce.boolean().default(false),
    equipment:z.string().optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
    goal: z.enum(["fat_loss", "muscle_gain", "endurance", "flexibility"]).default("fat_loss")
})