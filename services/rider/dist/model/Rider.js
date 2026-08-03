import mongoose, { Schema } from "mongoose";
const riderSchema = new Schema({}, { timestamps: true });
const Rider = mongoose.model("Rider", riderSchema);
export default Rider;
