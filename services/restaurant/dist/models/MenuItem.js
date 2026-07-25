import mongoose, { Schema } from "mongoose";
const menuSchema = new Schema({
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const MenuItem = mongoose.model("MenuItem", menuSchema);
export default MenuItem;
