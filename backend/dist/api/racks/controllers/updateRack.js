"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rack_1 = require("../../../assets/models/Rack");
const mongoose_1 = require("mongoose");
exports.default = async (req, res) => {
    try {
        const { id } = req.params || {};
        const body = req.body || {};
        if (!id) {
            return res
                .status(400)
                .json({ success: false, message: 'Rack ID is missing from the request' });
        }
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({ success: false, message: 'Rack ID is invalid' });
        }
        const updatedRack = await Rack_1.Rack.findByIdAndUpdate(id, body, { new: true });
        if (!updatedRack) {
            return res.status(404).json({ success: false, message: 'Rack not found' });
        }
        return res.status(200).json({ success: true, body: updatedRack });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
