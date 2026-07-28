import TryCatch from "../middlewares/tryCatch.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Restaurant from "../models/Restaurant.js";
const createOrder = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(400).json({
            message: "Unautorized."
        });
    }
    const { paymentMethod, addressId } = req.body;
    if (!addressId) {
        return res.status(400).json({
            message: "Address is required."
        });
    }
    const address = await Address.findOne({
        _id: addressId,
        userId: user._id
    });
    if (!address) {
        return res.status(404).json({
            message: "Address not found."
        });
    }
    const cartItems = await Cart.find({ userId: user._id })
        .populate("itemId")
        .populate("restaurantId");
    if (!cartItems) {
        return res.status(404).json({
            message: "Cart not found."
        });
    }
    if (cartItems.length === 0) {
        return res.status(400).json({
            message: "Add items in your cart!!!"
        });
    }
    const firstCartItem = cartItems[0];
    if (!firstCartItem || !firstCartItem.restaurantId) {
        return res.status(400).json({
            message: "Invailid Cart Data",
        });
    }
    const restaurantId = firstCartItem.resturantId._id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({
            message: "No restaurant with this id",
        });
    }
    if (!restaurant.isOpen) {
        return res.status(404).json({
            message: "Sorry this restaurant is closed for now",
        });
    }
});
export { createOrder };
