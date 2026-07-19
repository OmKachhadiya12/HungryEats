import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }
        await mongoose.connect(mongoUri, {
            dbName: "HungryEats",
        });
        console.log("MongoDB connected successfully.");
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};
export default connectDB;
