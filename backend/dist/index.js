"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const api_1 = __importDefault(require("./api"));
app.use('/api', api_1.default);
const express_2 = require("@trpc/server/adapters/express");
const trpc_1 = require("./trpc");
app.use('/trpc', (0, express_2.createExpressMiddleware)({
    router: trpc_1.appRouter
}));
mongoose_1.default
    .connect(process.env.MONGO_URI || '', {
    dbName: process.env.MONGO_DATABASE
})
    .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
    .catch((err) => {
    console.error('Database connection failed:', err);
});
