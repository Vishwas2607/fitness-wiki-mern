import { findExercises } from "../repositories/globalExercise.repository.js";
import { allowedLevels, attachCardio, buildDay, convertToArray, getSplit, groupByMuscle } from "../utils/helpers.js";
import { AppError } from "../utils/AppError.js";
import { templates } from "../models/workoutTemplate.js";

// Interacts with Global Exercises

export const generateCustomWorkout = async ({type, primaryMuscles,bodyWeight, equipment,experienceLevel}) => {
    const data = {};

    if (type) {data.type = type};
    if (targetedBodyPart) {
        const parts = convertToArray(targetedBodyPart);
        filter.targetedBodyPart = { $in: parts };
    };

    if (bodyWeight) {data.bodyWeight = bodyWeight};

    if (equipment) {
        const items = convertToArray(equipment);
        filter.equipment = { $in: items };
    };

    if (experienceLevel) {data.level = experienceLevel};

    const exercises =  await findExercises(data);

    if (!exercises || exercises.length === 0) throw new AppError("No exercise found", 400);
    
    const exerciseArr = exercises.map(exer => {
        let details = {exercise: exer._id, name: exer.title};

        return details
    });

    return exerciseArr;
};


export const generateRecommendedPlans = async ({days,equipment,level,goal}) => {

    const weekSplit = getSplit(parseInt(days));
    
    if (!equipment) {
        equipment = ["none"]
    } else{
        equipment = convertToArray(equipment)
    }

    const allowedLevel = allowedLevels(level);

    const filter = {equipment: {$in: equipment},level: {$in: allowedLevel} };
    const exercises = await findExercises(filter).lean();

    if (!exercises || exercises.length === 0) throw new AppError("No exercise found", 400);

    const exerciseMap = groupByMuscle(exercises);
  
    let workoutPlan = [];

    weekSplit.forEach(split => {
        const template = templates[split];
        if (!template) throw new AppError(`Template not found for ${split}`, 500);

        const exercisePerDay = buildDay(template,exerciseMap,goal);
        if (!exercisePerDay.exercises.length) throw new AppError(`No exercise found for ${split}`,404)
        workoutPlan.push(exercisePerDay);
    })

    const workoutPlanWithCardio = attachCardio(workoutPlan,goal);

    return workoutPlanWithCardio;
};