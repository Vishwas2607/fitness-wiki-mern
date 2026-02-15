import { createWorkoutPlan, findWorkoutAndDelete, findWorkoutPlanByName, findWorkoutPlansByUser } from "../repositories/workoutPlan.repository.js";
import { AppError } from "../utils/AppError.js";

export const savePlan = async(userId,{planName,goal, plan}) => {

    const existingName = await findWorkoutPlanByName(userId,planName);

    if (existingName) throw new AppError("Plan name already exists", 400);

    const data = {user:userId, name:planName, exercises:plan};
    if (goal) data.goal = goal;

    const savePlan = await createWorkoutPlan(data);
    if (!savePlan) throw new AppError("Plan not saved", 400)
    return savePlan.name;
};

export const getSavedPlans = async(userId) => {
    const plan = await findWorkoutPlansByUser(userId);

    if (plan.length === 0) throw new AppError("Workout Plan not found", 404);

    return plan;
};

export const mySpecificPlan = async(userId,name) => {
    const plan = await findWorkoutPlanByName(userId,name);

    if(!plan) throw new AppError("Plan not found", 404);

    return plan;
}

export const deletePlan = async(userId,name) => {
    const deletedPlan = await findWorkoutAndDelete(userId,name);

    if (deletePlan.deletedCount !== 1) throw new AppError("Failed to delete plan", 400);

    return deletedPlan;
}