"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@trpc/server");
const base_1 = require("../../../base");
const zod_1 = require("zod");
const Asset_1 = require("../../../../assets/models/Asset");
const mongoose_1 = require("mongoose");
const enums_1 = require("../../../../assets/enums/enums");
const Rack_1 = require("../../../../assets/models/Rack");
exports.default = base_1.publicProcedure
    .input(zod_1.z.object({
    uuid: zod_1.z.string(),
    name: zod_1.z.string(),
    rack: mongoose_1.Types.ObjectId,
    uPosition: zod_1.z.number(),
    manufacturer: enums_1.Manufacturers,
    notes: zod_1.z.string().optional(),
    dataFields: zod_1.z.object({
        title: zod_1.z.string(),
        value: zod_1.z.string(),
        path: zod_1.z.string()
    }).optional(),
    rawJson: zod_1.z.json()
}))
    .mutation(async ({ input }) => {
    const { uuid, name, rack, uPosition, manufacturer, notes, dataFields, rawJson } = input;
    if (!rack) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset rack ID missing from the request'
        });
    }
    if (!(0, mongoose_1.isValidObjectId)(rack)) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack ID is invalid'
        });
    }
    const targetRack = await Rack_1.Rack.findById(rack);
    if (!targetRack) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack not found'
        });
    }
    if (!name) {
        throw new server_1.TRPCError({
            code: "BAD_REQUEST",
            message: 'Asset name is missing from the request'
        });
    }
    if (!uuid) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset UUID is missing from the request'
        });
    }
    if (!manufacturer) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset manufacture is missing from the request'
        });
    }
    const manufactureName = Object.keys(enums_1.Manufacturers).find(key => enums_1.Manufacturers[key] === manufacturer);
    if (!manufactureName) {
        throw new server_1.TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset manufacture is not recognised'
        });
    }
    const existing = await Asset_1.Asset.findOne({ uuid, version: 1 });
    if (existing) {
        throw new server_1.TRPCError({
            code: 'CONFLICT',
            message: 'Asset already exists'
        });
    }
    const asset = await new Asset_1.Asset({
        name,
        uuid,
        version: 1,
        rack: targetRack._id,
        uPosition,
        manufacturer: manufactureName || 'HP',
        notes,
        dataFields,
        rawJson: JSON.stringify(rawJson, null, 2) || ''
    }).save();
    return {
        success: true,
        body: asset
    };
});
