"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const base_1 = require("../../../base");
const zod_1 = require("zod");
const Rack_1 = require("../../../../assets/models/Rack");
const mongoose_1 = require("mongoose");
exports.default = base_1.publicProcedure
    .input(zod_1.z.object({
    id: zod_1.z.string(),
    changes: zod_1.z
        .object({
        name: zod_1.z.string().optional(),
        size: zod_1.z.number().optional(),
        notes: zod_1.z.string().optional()
    })
        .refine((changes) => Object.keys(changes).length > 0, {
        message: 'At least one rack field must be provided'
    })
}))
    .mutation(async ({ input }) => {
    const { id, changes } = input;
    if (!id) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack ID is missing from the request'
        });
    }
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack ID is invalid'
        });
    }
    const rack = await Rack_1.Rack.findByIdAndUpdate(id, changes, { returnDocument: 'after' });
    if (!rack) {
        throw new server_1.TRPCError({
            code: 'NOT_FOUND',
            message: 'Rack not found'
        });
    }
    return {
        success: true,
        body: rack
    };
});
