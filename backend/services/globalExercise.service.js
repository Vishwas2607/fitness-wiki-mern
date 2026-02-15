import { createExercise, deleteExerciseById, findAllExercises, findExerciseBySlug } from "../repositories/globalExercise.repository.js";
import { AppError } from "../utils/AppError.js";
import { convertToArray, slugify } from "../utils/helpers.js";

export const createGlobalExercise = async({title,howToPerform,primaryMuscles,secondaryMuscles,movementPattern,trainingType,exerciseCategory,image,youtubeLink,bodyWeight,level,equipment}) => {

    if (!title || !howToPerform || !primaryMuscles || !trainingType || !exerciseCategory || !image) {
      throw new AppError("Missing required fields", 400);
    };

    const slug = slugify(title);

    const existingExercise = await findExerciseBySlug(slug);
    if (existingExercise) throw new AppError("Exercise already Exists", 400);
    const exerciseData = {title: title,slug:slug,howToPerform:convertToArray(howToPerform),primaryMuscles:convertToArray(primaryMuscles), trainingType:trainingType,exerciseCategory:exerciseCategory,image:image}

    if (secondaryMuscles) exerciseData.secondaryMuscles = convertToArray(secondaryMuscles);
    if (movementPattern) exerciseData.movementPattern = movementPattern
    if (youtubeLink) exerciseData.youtubeLink = youtubeLink;
    if(level) exerciseData.level = level;
    if (bodyWeight !== undefined) exerciseData.bodyWeight = bodyWeight;
    if (equipment) exerciseData.equipment = convertToArray(equipment);

    return await createExercise(exerciseData);
};

export const getGlobalExercises = async() => {
    const exercises = await findAllExercises();
    if(!exercises || exercises.length === 0) throw new AppError("No exercise found", 400)
    return exercises;
}

export const deleteExercise = async(id) => {
    const deletedExercise = await deleteExerciseById(id);

    if(!deletedExercise) throw new AppError("Failed to delete the exercise", 400)
    return deletedExercise;
}
