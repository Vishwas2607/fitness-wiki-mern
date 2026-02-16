import { createWorkoutPlan, findWorkoutAndDelete, findWorkoutPlanByName,findWorkoutPlanById, findWorkoutPlansByUser } from "../repositories/workoutPlan.repository.js";
import { AppError } from "../utils/AppError.js";

export const savePlan = async(userId,{planName,goal, plan, level}) => {

    const existingName = await findWorkoutPlanByName(userId,planName);

    if (existingName) throw new AppError("Plan name already exists", 400);

    const data = {user:userId, name:planName, plan:plan, level:level};
    if (goal) data.goal = goal;

    const savePlan = await createWorkoutPlan(data);
    if (!savePlan) throw new AppError("Plan not saved", 400)
    return savePlan.name;
};

export const getSavedPlans = async(userId) => {
    const savedPlans = await findWorkoutPlansByUser(userId);

    if (savedPlans.length === 0) throw new AppError("Workout Plan not found", 404);

    const plans = savedPlans.map(p=> {
        return {planId: p._id, name:p.name, goal:p.goal, level: p.level ? p.level : "beginner" }
    });
    return plans;
};

export const mySpecificPlan = async(userId,planId) => {
    const plan = await findWorkoutPlanById(userId,planId);

    if(!plan) throw new AppError("Plan not found", 404);

    return plan;
}

export const deletePlan = async(userId,planId) => {
    const deletedPlan = await findWorkoutAndDelete(userId,planId);

    if (deletePlan.deletedCount !== 1) throw new AppError("Failed to delete plan", 400);

    return deletedPlan;
}