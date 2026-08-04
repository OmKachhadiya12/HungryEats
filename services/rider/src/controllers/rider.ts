import axios from "axios";
import getBuffer from "../config/datarui.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import Rider from "../model/Rider.js";

const addRiderProfile = TryCatch(async (req:AuthenticatedRequest,res) => {

    const user = req.user;

    if(!user) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    if(user.role !== "rider") {
        return res.status(403).json({
            message: "Only rider can create the Rider profile."
        });
    }

    const file = req.file;

    if(!file) {
        return res.status(400).json({
            message: "Rider image is required."
        })
    }

    const fileBuffer = getBuffer(file);

    if(!fileBuffer || !fileBuffer?.content) {
        return res.status(500).json({
            message: "Failed to genrerate the File buffer."
        })
    }

    const { data: uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`,
        {
            buffer: fileBuffer.content
        }
    )

    const { phoneNumber,aadharNumber,drivingLicenseNumber,latitude,longitude } = req.body;

    if(!phoneNumber || !aadharNumber || !drivingLicenseNumber || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            message: "All fields are required."
        })
    }

    const existingRider = await Rider.findOne({
        userId: user._id
    })

    if(existingRider) {
        return res.status(401).json({
            message: "Rider profile is already exists."
        })
    }

    const riderProfile = await Rider.create({
        userId: user._id,
        picture: uploadResult.url,
        aadharNumber,
        drivingLicenseNumber,
        phoneNumber,
        location: {
            type: "Point",
            coordinates: [longitude,latitude]
        },
        isAvailable: false,
        isVerified: false
    })
    
    return res.json({
        message: "Rider profile created successfully.",
        riderProfile
    })

});

const fetchMyProfile = TryCatch(async (req:AuthenticatedRequest,res) => {

    const user = req.user;

    if(!user) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const riderProfile = await Rider.findOne({
        userId: user._id
    })

    if(!riderProfile) {
        return res.status(404).json({
            message: "Rider not found."
        })
    }

    res.json(riderProfile);
    
})

const toogleRiderAvailability = TryCatch(async (req:AuthenticatedRequest,res) => {

    const user = req.user;

    if(!user) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    if(user.role !== "rider") {
        return res.status(403).json({
            message: "Only Rider can toggle the Availablity."
        })
    }    
    
    const { isAvailable, latitude, longitude } = req.body;
    
    if(typeof isAvailable !== "boolean") {
        return res.status(400).json({
            message: "Only Boolean type is accepted."
        })
    }

    if(latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            message: "Location is required."
        })   
    }

    const rider = await Rider.findOne({userId: user._id})

    if(!rider) {
        return res.status(404).json({
            message: "Rider not found."
        })
    }

    if(isAvailable && !rider.isVerified) {
        return res.status(403).json({
            message: "Your are not Verified yet."
        })
    }

    rider.isAvailable = isAvailable;

    rider.location = {
        type: "Point",
        coordinates: [longitude,latitude]
    }

    rider.lastActiveAt = new Date();

    await rider.save();

    res.json({
        message: isAvailable ? "Rider is now online" : "Rider is now offline",
        rider,
    })
     
})

export { addRiderProfile, fetchMyProfile, toogleRiderAvailability }