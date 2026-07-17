import mongoose , {Document,Schema} from "mongoose";

export interface IUSER extends Document {
    name: string;
    email: string;
    image: string;
    role: string;
}

const userSchema: Schema<IUSER> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: null
    },
},{ timestamps: true });

const User = mongoose.model<IUSER>("User",userSchema);

export default User;