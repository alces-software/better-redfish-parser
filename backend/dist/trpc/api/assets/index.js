"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../../base");
const addAsset_1 = __importDefault(require("./controllers/addAsset"));
const addAssetVersion_1 = __importDefault(require("./controllers/addAssetVersion"));
const deleteAsset_1 = __importDefault(require("./controllers/deleteAsset"));
const getAllLatestAssets_1 = __importDefault(require("./controllers/getAllLatestAssets"));
const getAssetHistory_1 = __importDefault(require("./controllers/getAssetHistory"));
const getLatestAsset_1 = __importDefault(require("./controllers/getLatestAsset"));
exports.default = (0, base_1.router)({
    getAllLatest: getAllLatestAssets_1.default,
    getLatest: getLatestAsset_1.default,
    getHistory: getAssetHistory_1.default,
    delete: deleteAsset_1.default,
    add: addAsset_1.default,
    addVersion: addAssetVersion_1.default
});
