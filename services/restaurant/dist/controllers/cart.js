import mongoose from "mongoose";
import TryCatch from "../middlewares/tryCatch.js";
import Cart from "../models/Cart.js";
const addToCart = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Please Login."
        });
    }
    const userId = req.user._id;
    const { restaurantId, itemId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({
            message: "Invalid restaurant and item id",
        });
    }
    const cartFromDifferentRestaurant = await Cart.findOne({
        userId,
        restaurantId: { $ne: restaurantId },
    });
    if (cartFromDifferentRestaurant) {
        return res.status(400).json({
            message: "You can order from only one restaurant at a time. Please clear your cart first to add items from this restaurant."
        });
    }
    const cartItem = await Cart.findOneAndUpdate({ userId, restaurantId, itemId }, {
        $inc: { quantity: 1 },
        $setOnInsert: { userId, restaurantId, itemId },
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.json({
        message: "Item added to cart",
        cart: cartItem,
    });
});
const fetchMyCart = TryCatch(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Please Login."
        });
    }
    const userId = req.user._id;
    const cartItems = await Cart.find({ userId }).populate("itemId").populate("restaurantId");
    let subTotal = 0;
    let cartLength = 0;
    for (const cartItem of cartItems) {
        const item = cartItem.itemId;
        subTotal += item.price * cartItem.quantity;
        cartLength += cartItem.quantity;
    }
    return res.json({
        success: true,
        cartLength,
        subTotal,
        cart: cartItems,
    });
});
export { addToCart, fetchMyCart };
