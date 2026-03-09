import { cardioRules, MUSCLE_GROUPS } from "./constants.js";

export const convertToArray = (str = "") =>
  str.split(",").map(item => item.trim()).filter(Boolean);

export const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

export const buildExercisePools = (exercises) => {

  const strength = exercises.filter(
    ex => ex.trainingType === "strength"
  );

  const core = exercises.filter(
    ex => ex.exerciseCategory === "core"
  );

  const cardio = exercises.filter(
    ex => ex.trainingType === "cardio"
  );

  return {
    strength,
    core,
    cardio
  };
};

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

export const limitMovementPattern = (exercises) => {
  const patternCount = {};
  const filtered = [];

  for (const ex of exercises) {
    const pattern = ex.movementPattern || "other";

    if (!patternCount[pattern]) patternCount[pattern] = 0;

    if (patternCount[pattern] < 2) {
      filtered.push(ex);
      patternCount[pattern]++;
    }
  }

  return filtered;
};

export const scoreExercise = (exercise, prefs) => {
  let score = 0;

  if (prefs.goal === "strength" && exercise.exerciseCategory === "compound")
    score += 3;

  if (prefs.goal === "muscle_gain" && exercise.exerciseCategory === "compound")
    score += 2;

  if (prefs.bodyWeight === exercise.bodyWeight)
    score += 2;

  if (exercise.level === prefs.level)
    score += 2;

  if (
    prefs.primaryMuscles &&
    prefs.primaryMuscles.some(m => exercise.primaryMuscles.includes(m))
  )
    score += 5;

  if (
    prefs.primaryMuscles &&
    prefs.primaryMuscles.some(m =>
      exercise.secondaryMuscles?.includes(m)
    )
  ) {
    score += 3;
  }

  return score;
};

export const rankExercises = (exercises, prefs) => {
  return exercises
    .map(ex => ({
      ...ex,
      score: scoreExercise(ex, prefs)
    }))
    .sort((a, b) => b.score - a.score);
};

export const pickRandom = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const prioritizeFocus = (template, prefs) => {

  if (!prefs.primaryMuscles?.length) {
    return template;
  }

  const boostedFocus = [...template.focus];

  prefs.primaryMuscles.forEach(muscle => {
    if (template.focus.includes(muscle)) {
      boostedFocus.unshift(muscle);
    }
  });

  return {
    ...template,
    focus: boostedFocus
  };
};

export const buildDay = (template, exerciseMap, prefs, usedExercises) => {
  const volume = applyVolume(prefs.goal);
  const dayExercises = [];

  for (const muscle of template.focus) {
    const group = MUSCLE_GROUPS[muscle];
    const pool = exerciseMap[group];

    if (!pool) continue;

    const rankedCompounds = rankExercises(pool.compound, prefs).filter(ex=> !usedExercises.has(ex._id.toString()));
    const rankedIsolations = rankExercises(pool.isolation, prefs).filter(ex=> !usedExercises.has(ex._id.toString()));

    const compounds = pickRandom(
      rankedCompounds.slice(0, 6),
      Math.ceil(template.compoundCount / template.focus.length)
    );

    const isolations = pickRandom(
      rankedIsolations.slice(0, 6),
      Math.ceil(template.isolationCount / template.focus.length)
    );

    const seen = new Set();

    [...compounds, ...isolations].forEach(ex => {
      const id = ex._id.toString();

      if (seen.has(id) || usedExercises.has(id)) return;

      seen.add(ex._id);
      usedExercises.add(id);

      dayExercises.push({
        ...ex,
        ...volume
      });
    });
  }

  const balancedExercises = limitMovementPattern(dayExercises);
  const limitedExercises = balancedExercises.slice(0, template.exerciseCount || 6)

  const corePool = exerciseMap["core"];

  if (corePool && corePool.isolation?.length) {
    const coreExercise = pickRandom(corePool.isolation, 1)[0];

    if (coreExercise) {
      limitedExercises.push({
        ...coreExercise,
        ...volume
      });
    }
  }

  return { exercises: limitedExercises };
};

export const attachCardio = (plan,goal) => {
  const rule = cardioRules[goal] || {days: 0, duration:"0 min"};
  
  return plan.map((day, index) => {
    if (rule.days === 0) return
    
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