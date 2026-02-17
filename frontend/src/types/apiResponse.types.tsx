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
    userLevel: Level
}

export type SavedPlansResponse = {plans: SavedPlans[]};

export type ExerciseId = {
    _id: string,
    title: string,
    howToPerform: string[],
    image: string,
    primaryMuscles: string[],
    secondaryMuscles: string[],
    level: string,
    equipment: string[],
    trainingType: string,
    exerciseCategory: string,
};

export type Exercise = {
    exerciseId: ExerciseId,
    sets: string,
    reps: string,
    restTime: string
}

export type Cardio = {
    cardioType: string,
    duration: string
}
export interface DayDataType {
    exercises: Exercise[],
    cardio: Cardio | undefined | null
}

export interface MySpecificPlan {
    _id: string,
    name: string,
    goal: string,
    totalDays: number,
    dayData: DayDataType[]
}

export type MySpecificPlanResponse = {plan: MySpecificPlan}