export const isDev = process.env.NODE_ENV !== "production"

export const accessTokenOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 15 * 60 * 1000,
  path: "/"
};

export const refreshTokenOptions = {
  httpOnly: true,
  sameSite: "none" ,
  secure: true,
  path: "/api/auth/refresh-token",
  maxAge: 7 * 24 * 60 * 60 *1000
};


export const cardioRules = {
  fat_loss: {
    days: 3,
    duration: "20-30 min",
    intensity: "moderate"
  },
  muscle_gain: {
    days: 2,
    duration: "10-15 min",
    intensity: "low"
  }
};


export const MUSCLE_GROUPS = {
  lats: 'back',
  rhomboids: 'back',
  trapezius: 'back',
  erector_spinae: 'back',
  rear_deltoids: 'back',
  lower_back: 'back',
  back: "back",

  biceps: "biceps",
  arms: "biceps",

  triceps: 'triceps',

  chest: 'chest',
  shoulders: 'shoulders',

  quadriceps: 'legs',
  hamstrings: 'legs',
  glutes: 'legs',
  calves: 'legs',
  
  hip_flexors: 'core',
  core: 'core',
  obliques: 'core',
  abs: "core"
};

