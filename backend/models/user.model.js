import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email:{
        type:String,
        required: [true, "Email is required"],
        trim:true,
        lowercase:true,
        unique: true,
        match: [/.+@.+\..+/, "Please provide a valid email"]
    },
    password: {
        type: String,
        required:[true, "Password is required"],
        minlength: 8,
        select:false
    },
    refreshToken: {
        type: String,
        select:false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
    
},{
        timestamps: true
    }
);


const User = mongoose.model("User", userSchema);

export default User;