import axios from "axios";
import getBuffer from "../config/datarui.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken";

const addRestaurant = TryCatch(async (req:AuthenticatedRequest,res) => {

    const user = req.user;

    if(!user) {
        res.status(401).json({message: "You are Unauthorized."});
        return;
    }

    const existingRestaurant = await Restaurant.findOne({
        ownerId: user._id
    })

    if(existingRestaurant) {
        res.status(400).json({message: "You already have a Restaurant."});
        return;
    }

    const { name, description, latitude, longitude, formattedAddress, phone } = req.body;

    if (!name || !latitude || !longitude) {
        return res.status(400).json({
        message: "Please give all details.",
        });
    }

    const file = req.file;

    if(!file) {
        return res.status(400).json({
        message: "Please give image.",
        });
    }

    const fileBuffer = getBuffer(file);

    if(!fileBuffer?.content) {
        return res.status(500).json({
        message: "Failed to create the file buffer.",
        });
    }

    const {data: uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`,{
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

const fetchMyrestaurant = TryCatch(async (req:AuthenticatedRequest,res) => {

    if(!req.user) {
        return res.status(401).json({
            message: "Please login."
        });
    }

    const restaurant = await Restaurant.findOne({ownerId: req.user._id});

    if(!restaurant) {
        return res.status(400).json({
            message: "No Restaurant found",
        });
    }

    if(!req.user.restaurantId) {
        const token = jwt.sign({
            user: {
                ...req.user,
                restaurantId: restaurant._id
            },
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "15d",
            }
        );

        return res.json({ restaurant, token });
    }

    res.json({ restaurant });
    
})

const updateStatusRestaurant = TryCatch(async (req:AuthenticatedRequest,res) => {
    
    if(!req.user) {
        return res.status(401).json({
            message: "Please login."
        });
    }

    const {status} = req.body;

    if(typeof status !== "boolean") {
        return res.status(400).json({
            message: "Status must be boolean",
        });
    }

    const restaurant = await Restaurant.findOneAndUpdate({ownerId: req.user._id},{isOpen: status},{new: true});

    if(!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found",
        });
    }

    res.json({
      message: "Restaurant status Updated",
      restaurant,
    });

});

const updateRestaurant = TryCatch(async (req:AuthenticatedRequest,res) => {

    if(!req.user) {
        return res.status(401).json({message: "Please login."});
    }

    const {name, description} = req.body;

    const restaurant = await Restaurant.findOneAndUpdate({owner_d: req.user._id},{name: name, description: description},{new: true});

    if(!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found",
        });
    }

    res.json({
      message: "Restaurant Updated successfully",
      restaurant,
    });

});

export { addRestaurant, fetchMyrestaurant, updateStatusRestaurant, updateRestaurant };