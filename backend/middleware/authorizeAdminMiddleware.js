import { findUserById } from "../repositories/user.repository.js";

const authorizeAdminMiddleware = async(req,res,next) => {
    const userId = req.user;

    if (!req.user) {
     const error = new Error("Unauthorize");
     error.statusCode = 401;
     return next(error);
    }

    const user = await findUserById(userId);

    if (!user) {
     const error = new Error("Unauthorize");
     error.statusCode = 401;
     return next(error);
    };

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
}

export default authorizeAdminMiddleware;



// I am learning MERN, and I want a admin protected route and user protected route, so I used something like for testing, will it work and correct way ? Also I heard That for fewer admins manual promotion is good. First analyze this file then I will send you how I am authorizing it.