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
