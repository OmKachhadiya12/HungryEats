import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../middlewares/tryCatch.js";
import { oauth2client } from "../config/googleConfig.js";
import axios from "axios";
const loginUser = TryCatch(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            message: "Authorizatoin code is required.",
        });
    }
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    const { email, name, picture } = userRes.data;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            email,
            name,
            image: picture
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "12d",
    });
    res.status(200).json({
        message: "LoggedIn successfully.",
        token,
        user
    });
});
const allowedRoles = ["customer", "user", "driver"];
const addUserRole = TryCatch(async (req, res) => {
    if (!req.user?._id) {
        res.status(401).json({
            message: "Unauthorized",
        });
    }
    const { role } = req.body;
    if (!allowedRoles.includes(role)) {
        res.status(400).json({
            message: "Invalid Role",
        });
    }
    const user = await User.findByIdAndUpdate(req.user?._id, { role }, { new: true });
    if (!user) {
        res.status(404).json({
            message: "User not found",
        });
        return;
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "12d",
    });
    res.status(200).json({
        user,
        token
    });
});
const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.status(200).json({ user });
});
export { loginUser, addUserRole, myProfile };
