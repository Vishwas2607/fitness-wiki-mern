import { getDashboardDetail, getMe } from "../services/user.service.js";

export const dashboardController = async(req,res) => {
    const userId = req.user;

    const username = await getDashboardDetail(userId);

    res.status(200).json({username: username});
};

export const meController = async(req,res) => {
    const userId = req.user;
    const user = await getMe(userId);

    res.status(200).json({authenticated: true, username: user.username, role: user.role});
}

