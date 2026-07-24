"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturersEndpoint = void 0;
const __1 = require("../../..");
const enums_1 = require("../../../../assets/services/enums");
exports.ManufacturersEndpoint = __1.publicProcedure.query(() => {
    return {
        success: true,
        body: (0, enums_1.getManufacturers)()
    };
});
