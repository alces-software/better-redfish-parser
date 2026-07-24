"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const base_1 = require("../../../base");
const zod_1 = require("zod");
const Rack_1 = require("../../../../assets/models/Rack");
exports.default = base_1.publicProcedure
    .input(zod_1.z.object({
    name: zod_1.z.string(),
    size: zod_1.z.number(),
    notes: zod_1.z.string()
}))
    .mutation(async ({ input }) => {
    const { name, size, notes } = input;
    if (!name) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack name is missing from the request'
        });
    }
    const rack = await new Rack_1.Rack({ name, size, notes }).save();
    return {
        success: true,
        body: rack
    };
});
