"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const base_1 = require("./base");
const enums_1 = __importDefault(require("./api/enums"));
const racks_1 = __importDefault(require("./api/racks"));
const assets_1 = __importDefault(require("./api/assets"));
exports.appRouter = (0, base_1.router)({
    enums: enums_1.default,
    racks: racks_1.default,
    assets: assets_1.default
});
