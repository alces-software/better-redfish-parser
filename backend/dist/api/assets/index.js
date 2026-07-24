"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getAllLatestAssets_1 = __importDefault(require("./controllers/getAllLatestAssets"));
const getAssetHistory_1 = __importDefault(require("./controllers/getAssetHistory"));
const getLatestAsset_1 = __importDefault(require("./controllers/getLatestAsset"));
const deleteAsset_1 = __importDefault(require("./controllers/deleteAsset"));
const addAsset_1 = __importDefault(require("./controllers/addAsset"));
const addAssetVersion_1 = __importDefault(require("./controllers/addAssetVersion"));
exports.default = (0, express_1.Router)()
    .get('/', getAllLatestAssets_1.default)
    .get('/:uuid/history', getAssetHistory_1.default)
    .get('/:uuid', getLatestAsset_1.default)
    .delete('/:uuid', deleteAsset_1.default)
    .post('/', addAsset_1.default)
    .post('/:uuid', addAssetVersion_1.default);
