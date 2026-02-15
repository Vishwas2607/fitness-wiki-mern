import jwt from "jsonwebtoken"

export const generateAccessToken = (id,role) => {
    const accessToken = jwt.sign({sub:id, role:role},process.env.JWT_SECRET,{expiresIn:"15m"});
    return accessToken;
};

export const generateRefreshToken = (id,role) => {
    const refreshToken = jwt.sign({sub:id, role:role},process.env.JWT_REFRESH_SECRET,{expiresIn:"7d"});
    return refreshToken;
};