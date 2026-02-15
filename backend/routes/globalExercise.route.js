import express from "express";
import {createGlobalExerciseController, deleteGlobalExerciseController, getGlobalExercisesController } from "../controllers/globalExercise.controller.js";
import { validate } from "../middleware/validationMiddleware.js";
import { exerciseSchema } from "../../lib/schemas/globalExercise.validate.js";

const globalExerciseRouter =express.Router();

globalExerciseRouter.post("/",validate(exerciseSchema), createGlobalExerciseController);

globalExerciseRouter.get("/",getGlobalExercisesController);

globalExerciseRouter.delete("/:exerciseId", deleteGlobalExerciseController);

export default globalExerciseRouter;