import WorkoutPlan from "../models/workoutPlan.model.js"

export const createWorkoutPlan = (data)=> {
    return WorkoutPlan.create(data);
};

export const findWorkoutPlansByUser = (userId) => { 
    return WorkoutPlan.find({ user: userId }); 
};

export const findWorkoutPlanByName = (userId,name) => {
    return WorkoutPlan.findOne({user:userId, name: name});
};

export const findWorkoutAndDelete = (userId, name) => {
    return WorkoutPlan.deleteOne({user:userId, name: name});
}