"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const base_1 = require("../../../base");
const zod_1 = require("zod");
const Rack_1 = require("../../../../assets/models/Rack");
const mongoose_1 = require("mongoose");
const Asset_1 = require("../../../../assets/models/Asset");
exports.default = base_1.publicProcedure
    .input(zod_1.z.object({
    id: zod_1.z.string()
}))
    .mutation(async ({ input }) => {
    const { id } = input;
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack ID is invalid'
        });
    }
    const rack = await Rack_1.Rack.findByIdAndDelete(id);
    if (!rack) {
        throw new server_1.TRPCError({
            code: 'NOT_FOUND',
            message: 'Rack not found'
        });
    }
    await Asset_1.Asset.deleteMany({ rack: rack._id });
    return {
        success: true,
        message: 'Rack deleted'
    };
});
