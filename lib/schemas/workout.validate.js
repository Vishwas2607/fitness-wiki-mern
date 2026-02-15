import {z} from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const savePlanSchema = z.object({
    planName: z.string().trim().min(1, "Plan name is required"),

    goal: z.enum(["fat_loss", "muscle_gain", "endurance", "flexibility"]).optional(),

    plan: z.array(
        z.object({
            exercise: objectId,

            sets: z.number().int().min(1).optional(),

            reps: z.number().int().min(3).optional(),

            restTime: z.number().int().min(20).optional(),
        })
    )
    .min(1, "Atleast one exercise is required"),
});