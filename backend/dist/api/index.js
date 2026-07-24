"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const racks_1 = __importDefault(require("./racks"));
const enums_1 = __importDefault(require("./enums"));
exports.default = (0, express_1.Router)().use('/enums', enums_1.default).use('/racks', racks_1.default);
