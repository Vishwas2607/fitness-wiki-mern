import { createGlobalExercise, deleteExercise, getGlobalExercises, getOneExercise, updateGlobalExercise } from "../services/globalExercise.service.js";

export const createGlobalExerciseController = async(req,res) => {
    const newExercise = await createGlobalExercise(req.validatedBody);
    
    return res.status(201).json({message: `Successfully added ${newExercise.title} exercise`});
};

export const getGlobalExercisesController = async(req,res) => {

  const allExercises = await getGlobalExercises(req.validatedQuery);
  res.status(200).json({...allExercises}); 
};

export const deleteGlobalExerciseController = async(req,res) => {
  const deletedExercise = await deleteExercise(req.params.exerciseId);

  res.status(200).json({message: `Exercise with Id ${deletedExercise._id} is deleted successfully` })
}

export const getOneExerciseController = async(req,res) => {
  const exercise = await getOneExercise(req.params.exerciseId)
  res.status(200).json({...exercise})
}

export const updateGlobalExerciseController = async(req,res) => {
  const updatedExercise = await updateGlobalExercise(req.params.exerciseId, req.validatedBody)

  res.status(200).json({message: `Successfully updated ${updatedExercise} exercise`});
}