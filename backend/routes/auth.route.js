import express from "express"
import { validate } from "../middleware/validationMiddleware.js";
import { loginSchema, registerSchema } from "../../lib/schemas/auth.validator.js";
import { loginController, logoutController, refreshTokenController, registerController } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), registerController);
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.post("/refresh-token", refreshTokenController);
authRouter.post("/logout", logoutController)

export default authRouter;
