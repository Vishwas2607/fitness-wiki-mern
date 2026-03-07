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

export const findExerciseById = (id) => {
    return GlobalExercise.findById(id)
}

export const countAllExercises = () => {
    return GlobalExercise.countDocuments();
}

export const createExercise = (data) => {
    return GlobalExercise.create(data);
};

export const deleteExerciseById = (id) => {
    return GlobalExercise.findByIdAndDelete(id);
}

export const updateExerciseById = (id,data) => {
    return GlobalExercise.findByIdAndUpdate(id, data, {returnDocument: "after", runValidators: true})
}