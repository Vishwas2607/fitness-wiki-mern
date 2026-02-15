import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import globalExerciseRouter from "./routes/globalExercise.route.js";
import errorHandler from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import authMiddleware from "./middleware/authMiddleware.js";
import workoutRouter from "./routes/workout.route.js";
import authorizeAdminMiddleware from "./middleware/authorizeAdminMiddleware.js";
import { isDev } from "./utils/constants.js";

const app = express();
app.use(helmet());

const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


if (isDev){
    app.use(morgan("dev"));
};

app.use(express.json());
app.use(cookieParser());

const authLimiter= rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 500: 50,
    standardHeaders: true,
    legacyHeaders:false,
});

const generallimiter= rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isDev ? 1000: 200,
    standardHeaders: true,
    legacyHeaders:false,
});

app.use("/api/auth", authLimiter);
app.use("/api/", generallimiter);

app.use("/api/global-exercise", authMiddleware, authorizeAdminMiddleware, globalExerciseRouter);
app.use("/api/auth", authRouter);
app.use("/api",authMiddleware, userRouter); 
app.use("/api/workouts", authMiddleware, workoutRouter);

app.use((req,res,next)=> {
    res.status(404).json({message: "Route not found"});
})

app.use(errorHandler);

export default app;