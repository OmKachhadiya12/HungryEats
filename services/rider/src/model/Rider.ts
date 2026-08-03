import mongoose, { Document, Schema } from "mongoose";

export interface IRider extends Document {

}

const riderSchema = new Schema<IRider>({
    
},{timestamps: true});

const Rider = mongoose.model<IRider>("Rider",riderSchema);

export default Rider;