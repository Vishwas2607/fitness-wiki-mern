export type Goal = "fat_loss" | "muscle_gain" | "endurance" | "flexibility";
export type Level = "beginner" | "intermediate" | "advanced";

export interface CardsType {
    title:string,
    level: Level,
    type: string,
    url:string,
    goal: Goal,
    days: string,
    equipment: string,
}

export interface ModalProps {
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
}