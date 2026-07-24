"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const base_1 = require("../../../base");
const zod_1 = require("zod");
const Asset_1 = require("../../../../assets/models/Asset");
exports.default = base_1.publicProcedure
    .input(zod_1.z.object({
    uuid: zod_1.z.string()
}))
    .query(async ({ input }) => {
    const { uuid } = input;
    if (!uuid) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset UUID missing from the request'
        });
    }
    const asset = await Asset_1.Asset.findOne({ uuid }).sort({ version: -1 }).populate('rack');
    if (!asset) {
        throw new server_1.TRPCError({
            code: 'NOT_FOUND',
            message: 'Asset not found'
        });
    }
    return {
        success: true,
        body: asset
    };
});
