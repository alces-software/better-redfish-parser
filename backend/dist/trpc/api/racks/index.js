"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addRack_1 = __importDefault(require("./controllers/addRack"));
const base_1 = require("../../base");
const deleteRack_1 = __importDefault(require("./controllers/deleteRack"));
const getAllRacks_1 = __importDefault(require("./controllers/getAllRacks"));
const getRack_1 = __importDefault(require("./controllers/getRack"));
const updateRack_1 = __importDefault(require("./controllers/updateRack"));
exports.default = (0, base_1.router)({
    getById: getRack_1.default,
    get: getAllRacks_1.default,
    delete: deleteRack_1.default,
    update: updateRack_1.default,
    add: addRack_1.default
});
