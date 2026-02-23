import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";
import { findUserByEmail, createUser, findUserByUsername, findUserByEmailWithPassword, resetRefreshToken, findUserByIdWithRefreshToken, addRefreshTokenAndRole } from "../repositories/user.repository.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenGenerator.js";
import jwt from "jsonwebtoken";

export const registerUser = async ({ username, email, password }) => {

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    const existingUsername = await findUserByUsername(username);

    if (existingUsername) {
        throw new AppError("Username is already registered", 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await createUser({
        username,
        email,
        password: hashedPassword,
    });
};

export const loginUser = async({email,password}) => {
    const user = await findUserByEmailWithPassword(email);

    if(!user){
        throw new AppError("Invalid email or password", 401);
    };

    console.log(user.role)
    const isMatch = await bcrypt.compare(password,user.password);

    if (isMatch) {
        const accessToken = generateAccessToken(user._id,user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        const hashedRefreshToken = await bcrypt.hash(refreshToken,10);

        await addRefreshTokenAndRole(user._id, hashedRefreshToken);

        return {accessToken,refreshToken}
    } else{
        throw new AppError("Unauthorized", 401);
    }
};


export const refreshTokenGenerate = async(token) => {
    if(!token) {
        throw new AppError("Unauthorized", 401);
    }
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await findUserByIdWithRefreshToken(payload.sub);
    
    if (!user) {
        throw new AppError("Forbidden", 403)
    };

    const isMatch = await bcrypt.compare(token, user.refreshToken);
    
    if (!isMatch) {
    user.refreshToken = null;
    await user.save();
    throw new AppError("Refresh token reuse detected. Please login again.", 403);
    };
    
    const newAccessToken = generateAccessToken(payload.sub, user.role)
    const newRefreshToken = generateRefreshToken(payload.sub, user.role);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken,10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return {newAccessToken,newRefreshToken}
};

export const logoutUser = async(token) => {
    if(!token) {
        throw new AppError("Unauthorized", 401);
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await resetRefreshToken(payload.sub);

    if(!user) {
        throw new AppError("User not found", 404);
    };

    return { message: "User logged out successfully" };
}