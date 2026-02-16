import type {z} from "zod";
import {savePlanSchema, objectId} from "../../../lib/schemas/workout.validate"
import type { Goal, Level } from "./components.types";

export type DashboardResponse = {username : string}

export type AuthCheckResponse = {authenticated: boolean, username:string, role: string};

type CardioResponse = {type:string, duration: string};

type ObjectId = z.infer< typeof objectId>;

type RecommendedWorkoutExercise = {exercises: [{ _id: ObjectId, title: string, sets:string, reps:string, rest:string}], cardio: CardioResponse};

export type RecommendedWorkoutResponseData = {workoutPlan: RecommendedWorkoutExercise[]};

export type saveWorkoutPlan = z.infer<typeof savePlanSchema>

export interface SavedPlans {
    planId: ObjectId,
    name: string,
    goal: Goal,
    level: Level
}

export type SavedPlansResponse = {plans: SavedPlans[]};