export type DashboardResponse = {username : string}

export type AuthCheckResponse = {authenticated: boolean, username:string, role: string};

type CardioResponse = {type:string, duration: string};

type RecommendedWorkoutExercise = {exercises: [{ exerciseId: string, title: string, sets:string, reps:string, rest:string}], cardio: CardioResponse};

export type RecommendedWorkoutResponseData = {workoutPlan: RecommendedWorkoutExercise[]};