"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Asset_1 = require("../../../assets/models/Asset");
const Rack_1 = require("../../../assets/models/Rack");
const mongoose_1 = require("mongoose");
exports.default = async (req, res) => {
    try {
        const { uuid } = req.params || {};
        const { name, rack, uPosition, notes, dataFields, rawJson } = req.body || {};
        if (!uuid) {
            return res
                .status(400)
                .json({ success: false, message: 'Asset UUID is missing from the request' });
        }
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: 'Asset name is missing from the request' });
        }
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
        const currentAsset = await Asset_1.Asset.findOne({ uuid }).sort({ version: -1 });
        if (!currentAsset) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
        }
        const newVersion = await new Asset_1.Asset({
            uuid: currentAsset.uuid,
            version: currentAsset.version + 1,
            name: name ?? currentAsset.name,
            rack: targetRack._id ?? currentAsset.rack,
            uPosition: uPosition ?? currentAsset.uPosition,
            notes: notes ?? currentAsset.notes,
            dataFields: dataFields ?? currentAsset.dataFields,
            rawJson: rawJson ?? currentAsset.rawJson,
            manufacturer: currentAsset.manufacturer
        }).save();
        return res.status(201).json({ success: true, body: newVersion });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
