import { generateWorkout} from "../services/generateWorkout.service.js";
import { savePlan,getSavedPlans, mySpecificPlan, deletePlan } from "../services/savedWorkout.service.js";

export const generateWorkoutController = async(req,res) => {

    const workoutPlan = await generateWorkout(req.validatedQuery); 

    res.status(200).json({workoutPlan: workoutPlan});
};

export const saveWorkoutController = async(req,res) => {
    const userId = req.user;

    const plan = await savePlan(userId, req.validatedBody); // Validation done by Zod validate Middleware

    res.status(201).json({message: `${plan} Workout plan is successfully created.`})
};

export const getSavedPlansController = async(req,res) => {
    const plans = await getSavedPlans(req.user);

    res.status(200).json({plans: plans});
};

export const getMySpecificPlanController = async(req,res) => {

    const plan = await mySpecificPlan(req.user, req.params.planId,req.validatedQuery);

    res.status(200).json({plan:plan});
};

export const deletePlanController = async(req,res) => {
    const deletedPlan = await deletePlan(req.user, req.params.planId);

    res.status(200).json({message: "Plan deleted successfully"});
}