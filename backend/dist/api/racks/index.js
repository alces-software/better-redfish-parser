"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getAllRacks_1 = __importDefault(require("./controllers/getAllRacks"));
const getRack_1 = __importDefault(require("./controllers/getRack"));
const deleteRack_1 = __importDefault(require("./controllers/deleteRack"));
const addRack_1 = __importDefault(require("./controllers/addRack"));
const updateRack_1 = __importDefault(require("./controllers/updateRack"));
exports.default = (0, express_1.Router)()
    .get('/', getAllRacks_1.default)
    .get('/:id', getRack_1.default)
    .delete('/:id', deleteRack_1.default)
    .post('/', addRack_1.default)
    .put('/', updateRack_1.default);
