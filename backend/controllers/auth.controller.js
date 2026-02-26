import { loginUser, logoutUser, refreshTokenGenerate, registerUser } from "../services/auth.service.js";
import { accessTokenOptions, refreshTokenOptions } from "../utils/constants.js";

export const registerController = async (req, res) => {

    const user = await registerUser(req.validatedBody );

    res.status(201).json({
        message: "Successfully registered",
        userId: user._id,
        email: user.email,
        username: user.username
    });
};

export const loginController = async(req,res) => {
    const user = await loginUser(req.validatedBody );
    res.cookie("accessToken",user.accessToken,accessTokenOptions)
        .cookie("refreshToken", user.refreshToken, refreshTokenOptions)
        .status(200)
        .json({message: "Successfully Login"})
};

export const refreshTokenController = async(req,res) => {
    const token = req.cookies.refreshToken;

    const user = await refreshTokenGenerate(token);

    res.cookie("accessToken", user.newAccessToken, accessTokenOptions)
        .cookie("refreshToken", user.newRefreshToken, refreshTokenOptions)
        .status(200)
        .json({message:"Successfully refreshed tokens"})
};

export const logoutController = async(req,res) => {
    const token = req.cookies.refreshToken;
    await logoutUser(token);

    res.clearCookie("accessToken",accessTokenOptions)
        .clearCookie("refreshToken", refreshTokenOptions)
        .status(200)
        .json({message:"Successfully logout"})
};