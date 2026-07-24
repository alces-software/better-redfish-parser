"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../../assets/enums/enums");
const Asset_1 = require("../../../assets/models/Asset");
const Rack_1 = require("../../../assets/models/Rack");
const mongoose_1 = require("mongoose");
exports.default = async (req, res) => {
    try {
        const { rack, name, uuid, uPosition, manufacturer, notes, dataFields, rawJson } = req.body || {};
        if (!rack) {
            return res
                .json(400)
                .json({ success: false, message: 'Asset rack ID is missing from the request' });
        }
        if (!(0, mongoose_1.isValidObjectId)(rack)) {
            return res.status(400).json({ success: false, message: 'Rack ID is invalid' });
        }
        const targetRack = await Rack_1.Rack.findById(rack);
        if (!targetRack) {
            return res.status(404).json({ success: false, message: 'Rack not found' });
        }
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: 'Asset name is missing from the request' });
        }
        if (!uuid) {
            return res
                .status(400)
                .json({ success: false, message: 'Asset UUID is missing from the request' });
        }
        if (!manufacturer) {
            return res.status(400).json({ success: false, message: 'Asset manufacture is missing from the request' });
        }
        const manufactureName = Object.keys(enums_1.Manufacturers).find(key => enums_1.Manufacturers[key] === manufacturer);
        if (!manufactureName) {
            return res.status(400).json({ success: false, message: 'Asset manufacture is not recognised' });
        }
        const existing = await Asset_1.Asset.findOne({ uuid, version: 1 });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Asset already exists' });
        }
        const asset = await new Asset_1.Asset({
            name,
            uuid,
            version: 1,
            rack: targetRack._id,
            uPosition,
            manufacturer: manufactureName || 'HP',
            notes,
            dataFields,
            rawJson: JSON.stringify(rawJson, null, 2) || ''
        }).save();
        return res.status(201).json({ success: true, body: asset });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
