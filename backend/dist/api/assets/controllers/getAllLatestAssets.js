"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Asset_1 = require("../../../assets/models/Asset");
exports.default = async (req, res) => {
    try {
        const latestAssets = await Asset_1.Asset.aggregate([
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$uuid',
                    doc: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: { newRoot: '$doc' }
            }
        ]);
        return res.status(200).json({ success: true, body: latestAssets });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
