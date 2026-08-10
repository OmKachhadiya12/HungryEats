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

const acceptOrder = TryCatch(async (req:AuthenticatedRequest,res) => {

    const riderUserId = req.user?._id;
    const { orderId } = req.params;

    if(!riderUserId) {
        return res.status(401).json({
            message: "Please login"
        })
    }

    const rider = await Rider.findOne({
        userId: riderUserId,
        isAvailable: true
    })

    if(!rider) {
        return res.status(404).json({
            message: "Rider not found."
        })
    }

    try {

        const { data } = await axios.put(`${process.env.RESTAURANT_SERVICE}/api/order/assign/rider`,{
            orderId,
            riderId: rider._id.toString(),
            riderUserId: rider.userId,
            riderName: rider.picture,
            riderPhone: rider.phoneNumber,
        },{
            headers: {
                "x-internal-key": process.env.INTERNAL_SERVICE_KEY,
            }
        });

        if(data.success) {
            const riderDetails = await Rider.findOneAndUpdate({
                userId: riderUserId,
                isAvailable: true
            },{
                isAvailable: false
            },{
                new: true
            })
        }

        res.json({ message: "Order accepted" });
        
    } catch (error) {

        res.status(400).json({
            message: "Order already taken",
        });
        
    }
    
})

const fetchMyCurrentOrder = TryCatch(async (req:AuthenticatedRequest,res) => {

    const riderUserId = req.user?._id;

    if(!riderUserId) {
        return res.status(401).json({
            message: "Please Login."
        })
    }

    const rider = await Rider.findOne({
      userId: riderUserId,
      isVerified: true,
    });

    if (!rider) {
      return res.status(404).json({ message: "rider not found" });
    }

    try {
        const { data } = await axios.get(`${process.env.RESTAURANT_SERVICE}/api/order/current/rider?riderId=${rider._id}`,{
            headers: {
                "x-internal-key": process.env.INTERNAL_SERVICE_KEY,
            }
        });

        res.json({
            order: data,
        });
        
    } catch (error: any) {

        res.status(500).json({
            message: error.response.data.message,
        });
        
    }
})

const updateOrderStatus = TryCatch(async (req:AuthenticatedRequest,res) => {

    const userId = req.user?._id

    if(!userId) {
        return res.status(401).json({
            message: "Please login."
        })
    }

    const rider = await Rider.findOne({
        userId: userId
    });

    if(!rider) {
        return res.status(404).json({
            message: "Rider not found."
        })
    }

    const { orderId } = req.params;

    try {

        const { data } = await axios.put(`${process.env.RESTAURANT_SERVICE}/api/order/update/status/rider`,{
            orderId
        },{
            headers: {
                "x-internal-key": process.env.INTERNAL_SERVICE_KEY,
            }
        })

        res.json({
            message: data.message,
        });
        
    } catch (error: any) {

        console.log(error);
        res.status(500).json({
            message: error.response.data.message,
        });
        
    }
    
})

const fetchRiderHistory = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const riderUserId = req.user?._id;

    if (!riderUserId) {
      return res.status(401).json({
        message: "Please login.",
      });
    }

    const rider = await Rider.findOne({
      userId: riderUserId,
      isVerified: true,
    });

    if (!rider) {
      return res.status(404).json({
        message: "Rider not found.",
      });
    }

    const range = req.query.range || "30";

    try {
      const { data } = await axios.get(
        `${process.env.RESTAURANT_SERVICE}/api/order/rider/${rider._id}/history`,
        {
          params: {
            range,
          },
          headers: {
            "x-internal-key":
              process.env.INTERNAL_SERVICE_KEY,
          },
        }
      );

      return res.json(data);
    } catch (error: any) {
      console.log(error);

      return res.status(500).json({
        message:
          error.response?.data?.message ||
          "Failed to fetch rider history.",
      });
    }
  }
);

export { addRiderProfile, fetchMyProfile, toogleRiderAvailability, acceptOrder, fetchMyCurrentOrder, updateOrderStatus, fetchRiderHistory }