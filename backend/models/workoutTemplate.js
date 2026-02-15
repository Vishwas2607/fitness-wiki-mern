// workoutTemplates.js
export const templates = {
  PUSH: {
    focus: ["chest", "shoulders", "triceps"],
    exercisesCount: 6,
    compoundCount: 3,
    isolationCount: 3
  },

  PULL: {
    focus: ["back", "biceps"],
    exercisesCount: 6,
    compoundCount: 3,
    isolationCount: 3
  },

  LEGS: {
    focus: ["quadriceps", "hamstrings", "glutes","calves"],
    exercisesCount: 6,
    compoundCount: 4,
    isolationCount: 2
  },

  UPPER: {
    focus: ["chest", "back", "shoulders", "arms"],
    exerciseCount: 8,
    compoundCount: 5,
    isolationCount: 3
  },

  LOWER: {
    focus: ["quadriceps", "hamstrings", "glutes", "calves"],
    exerciseCount: 6,
    compoundCount: 4,
    isolationCount: 2
  },

  FULL: {
    focus: ["chest", "back", "shoulders", "quadriceps", "hamstrings","calves", "core","arms"],
    exerciseCount: 7,
    compoundCount: 6,
    isolationCount: 1
  },
};
