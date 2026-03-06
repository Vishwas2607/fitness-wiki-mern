import express from "express";
import {createGlobalExerciseController, deleteGlobalExerciseController, getGlobalExercisesController, getOneExerciseController } from "../controllers/globalExercise.controller.js";
import { validate, validateQuery } from "../middleware/validationMiddleware.js";
import { exerciseSchema, getAllExerciseQuerySchema } from "../../lib/schemas/globalExercise.validate.js";

const globalExerciseRouter =express.Router();

globalExerciseRouter.post("/",validate(exerciseSchema), createGlobalExerciseController);

globalExerciseRouter.get("/",validateQuery(getAllExerciseQuerySchema), getGlobalExercisesController);

globalExerciseRouter.delete("/:exerciseId", deleteGlobalExerciseController);
globalExerciseRouter.get("/:exerciseId", getOneExerciseController)

export default globalExerciseRouter;