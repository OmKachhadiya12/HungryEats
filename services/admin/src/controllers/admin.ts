import { ObjectId } from "mongodb";
import TryCatch from "../middlewares/tryCatch.js";
import { getRestaurantCollection, getRiderCollection } from "../util/collection.js";

const getPendingRestaurant = TryCatch(async (req,res) => {
    const restaurants = await(await getRestaurantCollection()).find({isVerified: false}).toArray();

    res.json({
        count: restaurants.length,
        restaurants
    })
})

const getPendingRider = TryCatch(async (req,res) => {
    const riders = await(await getRiderCollection()).find({isVerified: false}).toArray();

    res.json({
        count: riders.length,
        riders
    })
})

const verifyRestaurant = TryCatch(async (req,res) => {
    const { id } = req.params;

    if(typeof id !== "string") {
        return res.status(400).json({
            message: "Invalid restaurant Id."
        })
    }
    
    if(!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid object Id."
        })
    }

    const restaurant = await (await getRestaurantCollection()).updateOne({_id: new ObjectId(id)},{
        $set: {
            isVerified: true,
            updatedAt: new Date()
        }
    });

    if(restaurant.matchedCount === 0) {
        return res.status(404).json({
            message: "Restaurant not found."
        })
    }

    res.json({
        message: "Restaurant verified successfully."
    })

})

const verifyRider = TryCatch(async (req,res) => {
    const { id } = req.params;

    if(typeof id !== "string") {
        return res.status(400).json({
            message: "Invalid rider Id"
        })
    }

    if(!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid object Id."
        })
    }

    const rider = await (await getRiderCollection()).updateOne({_id: new ObjectId(id)},{
        $set: {
            isVerified: true,
            updatedAt: new Date()
        }
    });

    if(rider.matchedCount === 0){
        return res.status(404).json({
            message: "Rider not found."
        })
    }

    res.json({
        message: "Rider verified successfully."
    })
})

export { getPendingRestaurant, getPendingRider, verifyRestaurant, verifyRider}