"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../../base");
const Asset_1 = require("../../../../assets/models/Asset");
exports.default = base_1.publicProcedure.query(async () => {
    const assets = await Asset_1.Asset.aggregate([
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
    return {
        success: true,
        body: assets
    };
});
