import mongoose from "mongoose";

export async function connectDB() {
    try{
        const MONGO_URI = process.env.MONGO_URI;
        if(!MONGO_URI){
            throw new Error("MONGO_URI is not fount in .env");
        };
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB")
    } catch(err) {
        console.error(err);
        throw err;
    };
};