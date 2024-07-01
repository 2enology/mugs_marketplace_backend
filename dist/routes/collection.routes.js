"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collection_controller_1 = __importDefault(require("../controller/collection.controller"));
const router = (0, express_1.Router)();
// Create a new listed data
router.post("/create", collection_controller_1.default.create);
// Get all collection data
router.get("/", collection_controller_1.default.findAll);
exports.default = router;
