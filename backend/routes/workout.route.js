import express from "express";
import { generateWorkoutController } from "../controllers/workout.controller.js";
import { getSavedPlansController, getMySpecificPlanController, saveWorkoutController, deletePlanController } from "../controllers/workout.controller.js";
import { validate, validateQuery } from "../middleware/validationMiddleware.js";
import { getMySpecificPlanQuery, getWorkoutPreviewSchema, savePlanSchema } from "../../lib/schemas/workout.validate.js";

const workoutRouter = express.Router();

workoutRouter.get("/workout-preview",validateQuery(getWorkoutPreviewSchema), generateWorkoutController);

workoutRouter.post("/save-workout",validate(savePlanSchema), saveWorkoutController);

workoutRouter.get("/my-plans", getSavedPlansController);

workoutRouter.get("/my-plans/:planId",validateQuery(getMySpecificPlanQuery), getMySpecificPlanController);

workoutRouter.delete("/my-plans/:planId", deletePlanController);

export default workoutRouter;