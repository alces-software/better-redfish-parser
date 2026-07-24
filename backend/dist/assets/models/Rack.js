"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rack = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rackSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true,
        default: 1
    },
    notes: {
        type: String,
        default: ''
    }
});
exports.Rack = mongoose_1.default.model('Rack', rackSchema);
