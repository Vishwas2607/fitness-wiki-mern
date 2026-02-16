import { findExercises } from "../repositories/globalExercise.repository.js";
import { allowedLevels, attachCardio, buildDay, convertToArray, getSplit, groupByMuscle } from "../utils/helpers.js";
import { AppError } from "../utils/AppError.js";
import { templates } from "../models/workoutTemplate.js";

// Interacts with Global Exercises

export const generateWorkout = async ({type, primaryMuscles,bodyWeight, equipment, level,days,goal}) => {
    const data = {};
    const weekSplit = getSplit(parseInt(days));

    if (equipment) {
        const items = convertToArray(equipment);
        items.push("none")
        data.equipment = { $in: items };
    }else {
        data.equipment = {$in: ["none"]}
    }

    if (level) {data.level = allowedLevels(level)};

    const exercises =  await findExercises(data).lean();

    if (!exercises || exercises.length === 0) throw new AppError("No exercise found", 400);

    const exerciseMap = groupByMuscle(exercises);

    let workoutPlan = [];
    
    weekSplit.forEach(split => {
        const template = templates[split];
        if(!template) throw new AppError(`Template not found for ${split}`, 500);

        const exercisePerday = buildDay(template,exerciseMap,goal);

        if(!exercisePerday.exercises.length) throw new AppError(`No exercise found for the split ${split}`,400);
        workoutPlan.push(exercisePerday);
    })

    const workoutPlanWithCardio = attachCardio(workoutPlan,goal);

    return workoutPlanWithCardio;
};
