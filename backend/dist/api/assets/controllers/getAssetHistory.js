"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Asset_1 = require("../../../assets/models/Asset");
exports.default = async (req, res) => {
    try {
        const { uuid } = req.params || {};
        if (!uuid) {
            return res
                .status(400)
                .json({ success: false, message: 'Asset UUID is missing from the request' });
        }
        const assets = await Asset_1.Asset.find({ uuid }).populate('rack').sort({ version: -1 });
        if (!assets.length) {
            return res.status(404).json({ success: false, message: 'No asset history found' });
        }
        return res.status(200).json({ success: true, body: assets });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
