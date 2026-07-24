"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rack_1 = require("../../../assets/models/Rack");
exports.default = async (req, res) => {
    try {
        const { name, size, notes } = req.body || {};
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: 'Rack name is missing from the request' });
        }
        const rack = await new Rack_1.Rack({ name, size, notes }).save();
        return res.status(201).json({ success: true, body: rack });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
