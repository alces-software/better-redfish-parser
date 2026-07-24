"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManufacturers = getManufacturers;
const enums_1 = require("./enums");
function getManufacturers() {
    return Object.entries(enums_1.Manufacturers).map(([name, value]) => ({
        name,
        value
    }));
}
