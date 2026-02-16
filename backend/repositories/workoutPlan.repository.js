import WorkoutPlan from "../models/workoutPlan.model.js"

export const createWorkoutPlan = (data)=> {
    return WorkoutPlan.create(data);
};

export const findWorkoutPlansByUser = (userId) => { 
    return WorkoutPlan.find({ user: userId }); 
};

export const findWorkoutPlanByName = (userId,planName) => {
    return WorkoutPlan.findOne({user:userId, name:planName});
};

export const findWorkoutPlanById = (userId,planId) => {
    return WorkoutPlan.findOne({_id:planId,user:userId}).populate("plan.exercises.exerciseId");
}

export const findWorkoutAndDelete = (userId, planId) => {
    return WorkoutPlan.deleteOne({user:userId, _id:planId});
}