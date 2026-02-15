import express from "express";
import { generateCustomWorkoutController, generateRecommendedPlansController, getSavedPlansController, getMySpecificPlanController, saveWorkoutController, deletePlanController } from "../controllers/workout.controller.js";
import { validate } from "../middleware/validationMiddleware.js";
import { savePlanSchema } from "../../lib/schemas/workout.validate.js";

const workoutRouter = express.Router();

workoutRouter.get("/recommended-plans", generateRecommendedPlansController);
workoutRouter.post("/recommended-plans",validate(savePlanSchema), saveWorkoutController);

workoutRouter.get("/custom-workout", generateCustomWorkoutController )
workoutRouter.post("/custom-workout",validate(savePlanSchema), saveWorkoutController);

workoutRouter.get("/my-plans", getSavedPlansController);

workoutRouter.get("/my-plan/:planName", getMySpecificPlanController);

workoutRouter.delete("/my-plan/:planName", deletePlanController);

export default workoutRouter;