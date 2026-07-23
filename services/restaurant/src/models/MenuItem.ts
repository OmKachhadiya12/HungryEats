import mongoose, {Schema, Document, Types} from "mongoose";

export interface IMenuItem extends Document {
    restaurantId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    image?: string;
    price: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const menuSchema = new Schema<IMenuItem>({
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
  },{ timestamps: true }
);

const MenuItem = mongoose.model<IMenuItem>("MenuItem",menuSchema);

export default MenuItem;