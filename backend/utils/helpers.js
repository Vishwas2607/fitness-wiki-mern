import { cardioRules, MUSCLE_GROUPS } from "./constants.js";

export const convertToArray = (str = "") =>
  str.split(",").map(item => item.trim()).filter(Boolean);

export const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

export const normalizeString = (str) => {
  return str.toLowerCase().trim().replace(" ", "_");
}

export const groupByMuscle = (exercises) => {
  const map = {};

  for (const ex of exercises) {
    for (const muscle of ex.primaryMuscles) {
      const group = MUSCLE_GROUPS[normalizeString(muscle)];

      if (!map[group]) {
        map[group] = { compound: [], isolation: [] };
      }

      map[group][ex.exerciseCategory]?.push(ex);
    }
  }

  return map;
};

export const getSplit= (days) => {
  if (days <= 2) return ["FULL", "FULL"];
  if (days === 3) return ["PUSH", "PULL", "LEGS"];
  if (days === 4) return ["UPPER", "LOWER", "UPPER", "LOWER"];
  if (days === 5) return ["PUSH", "PULL","LEGS", "UPPER", "LOWER"]
  if (days === 6) return ["PUSH", "PULL", "LEGS","PUSH", "PULL", "LEGS"]
  if (days === 7) return ["PUSH", "PULL", "LEGS","PUSH", "PULL", "LEGS","REST"]
}

export const applyVolume = (goal) => {
  if (goal === "muscle_gain") {
    return { sets: 4, reps: "8-12", rest: "60-90s" };
  }
  if (goal === "fat_loss") {
    return { sets: 3, reps: "12-15", rest: "30-60s" };
  }
  if (goal === "strength") {
    return { sets: 6, reps: "4-6", rest: "60-90s" };
  }
};

export const buildDay = (template, exerciseMap, goal) => {
  const volume = applyVolume(goal);
  const dayExercises = [];

  const perMuscleCount = Math.floor(
    template.exercisesCount / template.focus.length
  );

  for (const muscle of template.focus) {
    const group = MUSCLE_GROUPS[muscle]
    const pool = exerciseMap[group];
    if (!pool) continue;
    const compounds = pool.compound.slice(0, 2);
    const isolations = pool.isolation.slice(0, perMuscleCount - 1);
    const combinedExercises = [...compounds, ...isolations]

    combinedExercises.forEach(ex =>{
     
      dayExercises.push({ ...ex, ...volume })
      }
    );
  }
  return { exercises: dayExercises };
};

export const attachCardio = (plan,goal) => {
  const rule = cardioRules[goal];
  
  return plan.map((day, index) => {
    if (index < rule.days) {
      return {
        ...day,
        cardio: {
          type: "treadmill",
          duration: rule.duration
        }
      };
    }
    return day
  });
};

export const allowedLevels = (level) => {
  let allowedLevel
  if (level === "intermediate") {
    allowedLevel = ["beginner","intermediate"]
  } else if (level === "advanced"){
    allowedLevel = ["beginner","intermediate", "advanced"]
  } else{
    allowedLevel = ["beginner"]
  }

  return allowedLevel
}