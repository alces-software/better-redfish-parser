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
        const result = await Asset_1.Asset.deleteMany({ uuid: uuid });
        return res.json({ success: true, deleted: result.deletedCount });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
