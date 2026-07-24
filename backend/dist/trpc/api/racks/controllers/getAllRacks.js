"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rack_1 = require("../../../../assets/models/Rack");
const base_1 = require("../../../base");
exports.default = base_1.publicProcedure.query(async () => {
    const racks = await Rack_1.Rack.find({});
    return {
        success: true,
        body: racks
    };
});
