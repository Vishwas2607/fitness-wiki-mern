import { ZodError } from "zod";
import { isDev } from "../utils/constants.js";

export default function errorHandler(err,req,res,next){
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "JsonWebTokenError"){
        statusCode = 403;
        message = "Forbidden";
    };

    if (err.name === "TokenExpiredError"){
        statusCode = 401;
        message = "Token Expired"
    };

    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation error",
            errors: err.errors?.map(e=> ({
                field: e.path[0],
                message: e.message
            }))
        });
    }

    if (isDev) {
        console.error(err.stack);
    } else {
        console.error("[Error]", err.message);
    };

    res.status(statusCode).json({success: false, message: message, ...(isDev && {stack: err.stack})});
}