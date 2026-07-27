import TryCatch from "../middlewares/tryCatch.js";
import Address from "../models/Address.js";
const addAddress = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(400).json({
            message: "Unauthorized."
        });
    }
    const { mobile, formattedAddress, longitude, latitude } = req.body;
    if (!mobile || !formattedAddress || longitude === undefined || latitude === undefined) {
        return res.status(400).json({
            message: "All feilds are required."
        });
    }
    const address = await Address.create({
        userId: user._id.toString(),
        mobile,
        formattedAddress,
        location: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
        }
    });
    res.json({
        message: "Address Added successfully",
        address: address,
    });
});
const deleteAddress = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(400).json({
            message: "Unauthorized."
        });
    }
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            message: "Address Id is required."
        });
    }
    const address = await Address.findOne({
        _id: id,
        userId: user._id.toString()
    });
    if (!address) {
        return res.status(404).json({
            message: "Address not found."
        });
    }
    res.json({
        message: "Address deleted successfully."
    });
});
const getMyAddresses = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(400).json({
            message: "Unauthorized."
        });
    }
    const addresses = await Address.find({
        userId: user._id.toString(),
    }).sort({ createdAt: -1 });
    res.json(addresses);
});
export { addAddress, deleteAddress, getMyAddresses };
