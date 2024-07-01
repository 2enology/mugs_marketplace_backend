"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listednfts_controller_1 = __importDefault(require("../controller/listednfts.controller"));
const router = (0, express_1.Router)();
// Create a new listed data
router.post("/create", listednfts_controller_1.default.create);
// Retrieve all listed data by seller
router.get("/findAllBySeller/:id", listednfts_controller_1.default.findAllBySeller);
// Retrieve all listed data by collection address
router.get("/findByCollectionAddr/:id", listednfts_controller_1.default.findByCollectionAddr);
// Retrieve a single listed data by mint address
router.get("/:mintAddr", listednfts_controller_1.default.findOne);
// Retrieve all listed data
router.get("/", listednfts_controller_1.default.findAll);
// Update a listed data
router.put("/", listednfts_controller_1.default.update);
// Delete a listed data by mint address
router.delete("/deletewithmintaddr/:mintAddr", listednfts_controller_1.default.delete);
// Delete listed data with array
router.delete("/", listednfts_controller_1.default.deleteListedNfts);
// Delete listed data with array to purchase
router.delete("/purchase", listednfts_controller_1.default.purchaseListedNfts);
// Delete all listed data
router.delete("/deleteall", listednfts_controller_1.default.deleteAll);
exports.default = router;
