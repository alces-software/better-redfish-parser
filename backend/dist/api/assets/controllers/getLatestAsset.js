"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Asset_1 = require("../../../assets/models/Asset");
exports.default = async (req, res) => {
    try {
        const { uuid } = req.params || {};
        if (!uuid) {
            return res
                .status(400)
                .json({ success: false, message: 'Asset UUID missing from the request' });
        }
        const asset = await Asset_1.Asset.findOne({ uuid }).sort({ version: -1 }).populate('rack');
        if (!asset) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
        }
        return res.status(200).json({ success: true, body: asset });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
