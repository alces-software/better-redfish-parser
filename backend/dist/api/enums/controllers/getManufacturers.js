"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../../../assets/enums/functions");
exports.default = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            body: (0, functions_1.getManufacturers)()
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};
