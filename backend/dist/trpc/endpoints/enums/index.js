"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumsRouter = void 0;
const base_1 = require("../../base");
const getManufacture_1 = __importDefault(require("./controllers/getManufacture"));
exports.enumsRouter = (0, base_1.router)({
    manufacturers: getManufacture_1.default
});
