import axios from "axios";
import getBuffer from "../config/datarui.js";
import TryCatch from "../middlewares/tryCatch.js";
import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken";
const addRestaurant = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "You are Unauthorized." });
        return;
    }
    const existingRestaurant = await Restaurant.findOne({
        ownerId: user._id
    });
    if (existingRestaurant) {
        res.status(400).json({ message: "You already have a Restaurant." });
        return;
    }
    const { name, description, latitude, longitude, formattedAddress, phone } = req.body;
    if (!name || !latitude || !longitude) {
        return res.status(400).json({
            message: "Please give all details.",
        });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "Please give image.",
        });
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer?.content) {
        return res.status(500).json({
            message: "Failed to create the file buffer.",
        });
    }
    const { data: uploadResult } = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`, {
        buffer: fileBuffer.content
    });
    const restaurant = await Restaurant.create({
        name,
        description,
        phone,
        image: uploadResult.url,
        ownerId: user._id,
        autoLocation: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
            formattedAddress,
        },
        isVerified: false,
    });
    return res.status(201).json({
        message: "Restaurant created successfully",
        restaurant,
    });
});
const fetchMyrestaurant = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Please login."
        });
    }
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
        return res.status(400).json({
            message: "No Restaurant found",
        });
    }
    if (!req.user.restaurantId) {
        const token = jwt.sign({
            user: {
                ...req.user,
                restaurantId: restaurant._id
            },
        }, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });
        return res.json({ restaurant, token });
    }
    res.json({ restaurant });
});
export { addRestaurant, fetchMyrestaurant };
