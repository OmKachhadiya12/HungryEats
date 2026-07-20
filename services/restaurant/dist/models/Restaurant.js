import mongoose, { Schema } from "mongoose";
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: String,
    image: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    autoLocation: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
        formattedAddress: {
            type: String,
        },
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
restaurantSchema.index({ autoLocation: "2dsphere" });
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
