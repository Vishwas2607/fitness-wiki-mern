import mongoose from "mongoose";
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

export const findPaginatedWorkoutPlan = async (userId,planId, page) => {
    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(planId),
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                name: 1,
                goal: 1,
                userLevel: 1,
                totalDays: {$size: "$plan"},
                dayData: {$slice: ["$plan", page-1,1]}
            }
        }
    ]

    const results = await WorkoutPlan.aggregate(pipeline);

    if (!results || results.length === 0) return null;

    return WorkoutPlan.populate(results[0], {path: "dayData.exercises.exerciseId", model:"GlobalExercise"});
}

export const findWorkoutAndDelete = (userId, planId) => {
    return WorkoutPlan.deleteOne({user:userId, _id:planId});
}
