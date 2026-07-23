import axios from "axios";
import getBuffer from "../config/datarui.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

const addMenuItem = TryCatch(async (req:AuthenticatedRequest,res) => {

    if(!req.user) {
        return res.status(401).json({
            message: "Please login",
        });
    }

    const restaurant = await Restaurant.findOne({ownerId: req.user._id});

    if(!restaurant) {
        return res.status(404).json({message: "Restaurant not found."});
    }

    const {name, description, price} = req.body;

    if(!name || !price) {
        return res.status(400).json({
            message: "Name and Price feilds are required."
        })
    }

    const file = req.file;

    if(!file) {
        return res.status(400).json({
            message: "Image feild is required."
        })
    }

    const fileBuffer = getBuffer(file);

    if(!fileBuffer?.content) {
        return res.status(500).json({
            message: "Failed to create the File buffer."
        })
    }

    const { data: uploadResult } = await axios.post(
        `${process.env.UTILS_SERVICE}/api/upload`,
        {
            buffer: fileBuffer.content,
        }
    );

    const item = await MenuItem.create({
        name,
        description,
        price,
        restaurantId: restaurant._id,
        image: uploadResult.url,
    });

  res.json({
    message: "Item Added Successfully",
    item,
  });
    
});

const getAllItems = TryCatch(async (req:AuthenticatedRequest,res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
        message: "Id is required",
        });
    }

    const items = await MenuItem.find({ restaurantId: id });

    res.json(items);
    
});

const deleteMenuItem = TryCatch(async (req:AuthenticatedRequest,res) => {

    if(!req.user) {
        return res.status(401).json({
            message: "Please login",
        });
    }

    const { itemId } = req.params;

    if (!itemId) {
        return res.status(400).json({
        message: "Id is required",
        });
    }

    const item = await MenuItem.findById(itemId);

    if(!item) {
        return res.status(404).json({
            message: "Item not found."
        })
    }

    const restaurant = await Restaurant.findOne({
        _id: item.restaurantId,
        ownerId: req.user._id
    })

    if(!restaurant) {
        return res.status(404).json({message: "Restaurant not found."});
    }

    await item.deleteOne();

    res.json({
        message: "Menu Item deleted successfully."
    })
    
})

const toggleMenuItemAvailability = TryCatch(async (req:AuthenticatedRequest,res) => {

    if(!req.user) {
        return res.status(401).json({
            message: "Please login",
        });
    }

    const { itemId } = req.params;

    if (!itemId) {
        return res.status(400).json({
        message: "Id is required",
        });
    }

    const item = await MenuItem.findById(itemId);

    if(!item) {
        return res.status(404).json({
            message: "Item not found."
        })
    }

    const restaurant = await Restaurant.findOne({
        _id: item.restaurantId,
        ownerId: req.user._id
    })

    if(!restaurant) {
        return res.status(404).json({message: "Restaurant not found."});
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({
      message: `Item Marked as ${
        item.isAvailable ? "available" : "unavailable"
      }`,
      item,
    });
    
})

export { addMenuItem, getAllItems, deleteMenuItem, toggleMenuItemAvailability };