import User from "../models/user.model.js";

export const findUserByEmail = (email) => {
    return User.findOne({ email });
};

export const createUser = (userData) => {
    return User.create(userData);
};

export const findOneUser = (email,username) => {
    return User.findOne({
        $or: [{email, username}]
    });
}

export const findUserByEmailWithPassword = (email) => {
    return User.findOne({ email }).select("+password");
};

export const findUserByIdWithRefreshToken = (userId) => {
    return User.findById(userId).select("+refreshToken");
};

export const findUserByUsername= (username) => {
    return User.findOne({username})
};

export const findUserById = (id) => {
    return User.findById(id);
};


export const addRefreshTokenAndRole = async(id,refreshToken,role) => {
    return User.findByIdAndUpdate(
        id,
        { refreshToken,role },
        { new: true }
    )
};

export const resetRefreshToken = (id) => {
    return User.findByIdAndUpdate(
        id,
        {refreshToken: ""},
        {new:true}
    )
};