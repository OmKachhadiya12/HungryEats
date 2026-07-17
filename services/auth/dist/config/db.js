import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "HungryEats",
        });
        console.log("MongoDB connected Successfully.");
    }
    catch (error) {
        console.log("Error in connecting MongoDB.");
    }
};
export default connectDB;
