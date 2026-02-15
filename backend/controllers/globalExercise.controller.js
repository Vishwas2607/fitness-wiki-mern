import { createGlobalExercise, deleteExercise, getGlobalExercises } from "../services/globalExercise.service.js";

export const createGlobalExerciseController = async(req,res) => {
    const newExercise = await createGlobalExercise(req.body);
    
    return res.status(201).json({message: `Successfully added ${newExercise.title} exercise`});
};

export const getGlobalExercisesController = async(req,res) => {
  const allExercises = await getGlobalExercises();
  res.status(200).json({exercises: allExercises}); 
};

export const deleteGlobalExerciseController = async(req,res) => {
  const deletedExercise = await deleteExercise(req.params.exerciseId);

  res.status(200).json({message: `Exercise with Id ${deletedExercise._id} is deleted successfully` })
}