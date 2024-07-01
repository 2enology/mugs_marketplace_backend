"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collection_model_1 = __importDefault(require("../model/collection.model"));
class CollectionController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body.data;
                // Check if the collection with the given address already exists
                const existingCollection = yield collection_model_1.default.findOne({
                    collectionAddr: data.collectionAddr,
                });
                if (existingCollection) {
                    // Update the existing user
                    existingCollection.set(data);
                    const updatedData = yield existingCollection.save();
                    console.log("Collection data updated successfully!");
                    res.status(201).json({
                        message: "User created successfully",
                        type: "success",
                        data: updatedData,
                    });
                }
                else {
                    // Create a new user
                    const newUser = new collection_model_1.default(data);
                    const updatedData = yield newUser.save();
                    res.status(201).json({
                        message: "User created successfully",
                        type: "success",
                        data: updatedData,
                    });
                    console.log("Collection data saved successfully!");
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: "Some error occurred while creating the collection.",
                });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield collection_model_1.default.find({});
                if (!data || data.length === 0) {
                    res.status(404).send({ message: "No Collections found" });
                }
                else {
                    res.send(data);
                }
            }
            catch (err) {
                res.status(500).send({
                    message: err.message ||
                        "Some error occurred while retrieving collection data.",
                });
            }
        });
    }
}
exports.default = new CollectionController();
