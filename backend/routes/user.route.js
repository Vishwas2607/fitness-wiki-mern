import express from "express";
import { dashboardController, meController } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/dashboard", dashboardController);
userRouter.get("/me", meController);

export default userRouter;