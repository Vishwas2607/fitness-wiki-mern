import { findUserById } from "../repositories/user.repository.js"
import { AppError } from "../utils/AppError.js";

export const getDashboardDetail = async(id) => {
    const user = await findUserById(id);

    if (!user) {
        throw new AppError("User not found", 404);
    };

    return user.username;
};

export const getMe = async(id) => {
    const user = await findUserById(id);

    if (!user) {
        throw new AppError("User not found", 404);
    };

    return {username: user.username, role: user.role};
}
