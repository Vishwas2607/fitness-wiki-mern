import { createWorkoutPlan, findWorkoutAndDelete, findWorkoutPlanByName, findWorkoutPlansByUser, findPaginatedWorkoutPlan } from "../repositories/workoutPlan.repository.js";
import { AppError } from "../utils/AppError.js";

export const savePlan = async(userId,{planName,goal, plan, userLevel}) => {

    const existingName = await findWorkoutPlanByName(userId,planName);

    if (existingName) throw new AppError("Plan name already exists", 400);

    const data = {user:userId, name:planName, plan:plan, userLevel:userLevel};
    if (goal) data.goal = goal;

    const savePlan = await createWorkoutPlan(data);
    if (!savePlan) throw new AppError("Plan not saved", 400)
    return savePlan.name;
};

export const getSavedPlans = async(userId) => {
    const savedPlans = await findWorkoutPlansByUser(userId);

    if (savedPlans.length === 0) throw new AppError("No saved Workout Plan", 400);

    const plans = savedPlans.map(p=> {
        return {planId: p._id, name:p.name, goal:p.goal, userLevel: p.userLevel }
    });
    return plans;
};

export const mySpecificPlan = async(userId,planId,{page}) => {
    const plan = await findPaginatedWorkoutPlan(userId,planId,page);

    if(!plan) throw new AppError("Plan not found", 404);

    return plan;
}

export const deletePlan = async(userId,planId) => {
    const result = await findWorkoutAndDelete(userId,planId);

    if (result.deletedCount !== 1) throw new AppError("Failed to delete plan", 400);

    return result;
}


