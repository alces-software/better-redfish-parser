"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../../base");
const functions_1 = require("../../../../assets/enums/functions");
exports.default = base_1.publicProcedure.query(async () => {
    return {
        success: true,
        body: (0, functions_1.getManufacturers)()
    };
});
