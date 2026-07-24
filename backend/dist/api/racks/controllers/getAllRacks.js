"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rack_1 = require("../../../assets/models/Rack");
exports.default = async (req, res) => {
    try {
        const racks = await Rack_1.Rack.find();
        return res.status(200).json({ success: true, body: racks });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
