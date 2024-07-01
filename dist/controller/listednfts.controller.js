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
const web3_js_1 = require("@solana/web3.js");
const listednfts_model_1 = __importDefault(require("../model/listednfts.model"));
const activity_model_1 = __importDefault(require("../model/activity.model"));
const offer_model_1 = __importDefault(require("../model/offer.model"));
const devnetEndpoint = "https://devnet.helius-rpc.com/?api-key=9f24866e-8119-4ac1-978f-16581afb6cfe";
const solConnection = new web3_js_1.Connection(devnetEndpoint);
// Confirm the list transaction
function sendTransaction(transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            commitment: "confirmed",
            skipPreflight: true,
        };
        const signature = yield solConnection.sendRawTransaction(transaction, options);
        console.log("list signature: ", signature);
        return signature;
    });
}
// Get ListedNftsArray function
function createListedNftsArray(listData) {
    return listData.map((data) => ({
        tokenId: data.tokenId,
        collectionAddr: data.collectionAddr,
        imgUrl: data.imgUrl,
        mintAddr: data.mintAddr,
        seller: data.seller,
        metaDataUrl: data.metaDataUrl,
        solPrice: data.solPrice,
        tokenPrice: data.tokenPrice,
    }));
}
// Get ActivityDataArray function
function createActivityDataArray(listData) {
    return listData.map((data) => ({
        imgUrl: data.imgUrl,
        tokenId: data.tokenId,
        mintAddr: data.mintAddr,
        txType: data.txType,
        solPrice: data.solPrice,
        tokenPrice: data.tokenPrice,
        seller: data.seller,
        buyer: data.buyer,
    }));
}
class ListedNftsController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const txs = req.body.transactions;
                const signatures = yield Promise.all(txs.map((tx) => sendTransaction(tx)));
                yield Promise.all(signatures.map((signature) => solConnection.confirmTransaction(signature, "confirmed")));
                const listedNftsArray = createListedNftsArray(req.body.listData);
                const activityDatasArray = createActivityDataArray(req.body.listData);
                yield listednfts_model_1.default.create(listedNftsArray);
                const createdListings = yield activity_model_1.default.create(activityDatasArray);
                res.send(createdListings);
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: "Some error occurred while creating the ListedNfts.",
                });
            }
        });
    }
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mintAddr } = req.params;
            try {
                const data = yield listednfts_model_1.default.findOne({ mintAddr });
                if (!data) {
                    res
                        .status(404)
                        .send({ message: "Not found ListedNfts with walletAddr and seller" });
                }
                else {
                    res.send(data);
                }
            }
            catch (err) {
                res.status(500).send({
                    message: "Error retrieving ListedNfts with walletAddr and seller",
                });
            }
        });
    }
    findAllBySeller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seller = req.params.id;
                const data = yield listednfts_model_1.default.find({ seller });
                res.send(data);
            }
            catch (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving ListedNfts.",
                });
            }
        });
    }
    findByCollectionAddr(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collectionAddr = req.params.id;
                const data = yield listednfts_model_1.default.find({ collectionAddr });
                res.send(data);
            }
            catch (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving ListedNfts.",
                });
            }
        });
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield listednfts_model_1.default.find({});
                if (!data || data.length === 0) {
                    res.status(404).send({ message: "No ListedNfts found" });
                }
                else {
                    res.send(data);
                }
            }
            catch (err) {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving ListedNfts.",
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transaction, updateData, mintAddr } = req.body;
            try {
                const txId = yield sendTransaction(transaction);
                yield solConnection.confirmTransaction(txId, "finalized");
                const now = Date.now();
                const updatedListedNft = yield listednfts_model_1.default.findOneAndUpdate({ mintAddr }, Object.assign(Object.assign(Object.assign({ solPrice: updateData.solPrice, tokenPrice: updateData.tokenPrice, createdAt: now }, (updateData.solPrice !== undefined && {
                    lastSolPriceChangeAt: now,
                })), (updateData.tokenPrice !== undefined && {
                    lastTokenPriceChangeAt: now,
                })), { updatedAt: now }));
                if (!updatedListedNft) {
                    res.status(404).send({
                        message: `Cannot update ListedNfts. Maybe ListedNfts was not found!`,
                    });
                }
                const createdListings = yield activity_model_1.default.create({
                    imgUrl: updateData.imgUrl,
                    tokenId: updateData.tokenId,
                    mintAddr: updateData.mintAddr,
                    txType: updateData.txType,
                    solPrice: updateData.solPrice,
                    tokenPrice: updateData.tokenPrice,
                    seller: updateData.seller,
                    buyer: updateData.buyer,
                });
                res.send({
                    message: "ListedNfts was updated successfully.",
                    data: createdListings,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({
                    message: "Some error occurred while updating the price",
                    error: error.message,
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const mintAddr = req.params.mintAddr;
            try {
                const data = yield listednfts_model_1.default.findOneAndDelete({ mintAddr });
                if (!data) {
                    res.status(404).send({
                        message: `Cannot delete ListedNfts with mintAddr=${mintAddr}. Maybe ListedNfts was not found!`,
                    });
                }
                else {
                    res.send({ message: "ListedNfts was deleted successfully!" });
                }
            }
            catch (err) {
                res.status(500).send({
                    message: `Could not delete ListedNfts with mintAddr=${mintAddr}`,
                });
            }
        });
    }
    deleteListedNfts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transactions: txs, delistData, mintAddrArray } = req.body;
            try {
                const signatures = yield Promise.all(txs.map((tx) => sendTransaction(tx)));
                yield Promise.all(signatures.map((signature) => solConnection.confirmTransaction(signature, "confirmed")));
                const deleteResult = yield listednfts_model_1.default.deleteMany({
                    mintAddr: { $in: mintAddrArray },
                });
                const offerUpdateData = yield offer_model_1.default.updateMany({ mintAddr: { $in: mintAddrArray } }, { $set: { active: 0 } });
                if (!offerUpdateData) {
                    res.status(404).send({
                        message: `Cannot update OfferDatas with mintAddr=${mintAddrArray}. Maybe ListedData was not found!`,
                    });
                }
                if (deleteResult.deletedCount === 0) {
                    res.status(404).send({
                        message: `Cannot delete ListedNfts with mintAddrs=${mintAddrArray}. Maybe they were not found.`,
                    });
                }
                const activityDataArray = createActivityDataArray(delistData);
                yield activity_model_1.default.create(activityDataArray);
                res.status(200).send({
                    message: `ListedNfts with mintAddrs=${mintAddrArray} were deleted successfully!`,
                    count: deleteResult.deletedCount,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: `Could not delete ListedNfts with mintAddrs=${mintAddrArray}`,
                });
            }
        });
    }
    // Delete a ListedNfts with the specified mintAddr in the request
    purchaseListedNfts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { transaction: txs, purchaseData, mintAddrArray } = req.body;
            try {
                let signatures = yield Promise.all(txs.map((tx) => sendTransaction(tx)));
                yield Promise.all(signatures.map((signature) => solConnection.confirmTransaction(signature, "confirmed")));
                // Delete listed NFTs from database
                const deleteResult = yield listednfts_model_1.default.deleteMany({
                    mintAddr: { $in: mintAddrArray },
                });
                // Update all offers where `mintAddr` is same and `buyer` is different
                const offerUpdateData = yield offer_model_1.default.updateMany({ mintAddr: { $in: mintAddrArray } }, { $set: { active: 0 } });
                if (!offerUpdateData) {
                    res.status(404).send({
                        message: `Cannot update OfferDatas with mintAddr=${mintAddrArray}. Maybe ListedData was not found!`,
                    });
                }
                if (deleteResult.deletedCount === 0) {
                    res.status(404).send({
                        message: `Cannot delete ListedNfts with mintAddrs=${mintAddrArray}. Maybe they were not found.`,
                    });
                }
                // Save activity data to database
                const activityDataArray = createActivityDataArray(purchaseData);
                yield activity_model_1.default.create(activityDataArray);
                // Return success response
                res.status(200).send({
                    message: `ListedNfts with mintAddrs=${mintAddrArray} were deleted successfully!`,
                    count: deleteResult.deletedCount,
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).send({
                    message: `Could not delete ListedNfts with mintAddrs=${mintAddrArray}`,
                });
            }
        });
    }
    // Delete all ListedNfts from the database.
    deleteAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            listednfts_model_1.default.deleteMany({})
                .then((data) => {
                res.send({
                    message: `${data.deletedCount} ListedNfts were deleted successfully!`,
                });
            })
                .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while removing all ListedNfts.",
                });
            });
        });
    }
}
exports.default = new ListedNftsController();
