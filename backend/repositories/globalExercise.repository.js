import GlobalExercise from "../models/globalExercise.model.js"

export const findExercises = (filter)=> {
    return GlobalExercise.find(filter)
};

export const findExerciseBySlug = (slug) => {
    return GlobalExercise.findOne({slug: slug})
};

export const findAllExercises = (limit,skip) => {
    return GlobalExercise.find().sort({createdAt:-1}).limit(limit).skip(skip);
};

export const countAllExercises = () => {
    return GlobalExercise.countDocuments();
}

export const createExercise = (data) => {
    return GlobalExercise.create(data);
};

export const deleteExerciseById = (id) => {
    return GlobalExercise.findByIdAndDelete(id);
}

// Hii, I am learning MERN and making my second project Fitness Planner, like muscleWiki and fitnessProgrammer.
// I already made a global exercise model, and defined routes and used it to add some exercises via postman, after that I will change it to admin only panel.

// User model, auth routes all are done. Now just finished user's route like what users can see and what actions they can perform etc. 
// Update, delete and admin panel is only left to make my project start working, after that I will add other features.

// So if you can check my codes and give me opinion on how I am doing is it good or bad, Your reviews.

// Some things to mention before sending files to you, I am using express V5+ so no need for async handler or wrapper, and validation of input is done by zod and I have a global error handler too. 

// I have 32 files in backend, ooh yes I forgot to tell you I am using express + mongoose. Just give your honest opinion no sugarcoat, tell me only if my logic breaks somewhere or any bugs are there, okay ?

// I want to send one file at a time, If file is small or related then at once like all validation schema in one go, etc.

// Using JWT with cookies, currently I am assigning user role to every login uses, after that I will make a dedicated auth route for admin and change role to admin, okay. It's halfway now.

// Should I start with app.js and server.js at once ?
// Also which file you need next tell me.