import { Request, Response } from "express";
import mongoose from "mongoose";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import ListedNfts from "../model/listednfts.model";
import ActivityData from "../model/activity.model";
import OfferData from "../model/offer.model";

const devnetEndpoint =
  "https://devnet.helius-rpc.com/?api-key=9f24866e-8119-4ac1-978f-16581afb6cfe";
const solConnection = new Connection(devnetEndpoint);

// Confirm the list transaction
async function sendTransaction(transaction: any): Promise<string> {
  const options = {
    commitment: "confirmed",
    skipPreflight: true,
  };
  const signature = await solConnection.sendRawTransaction(
    transaction,
    options
  );
  console.log("list signature: ", signature);
  return signature;
}

// Get ListedNftsArray function
function createListedNftsArray(listData: any[]): any[] {
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
function createActivityDataArray(listData: any[]): any[] {
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
  async create(req: Request, res: Response): Promise<void> {
    try {
      const txs = req.body.transactions;
      const signatures = await Promise.all(
        txs.map((tx: any) => sendTransaction(tx))
      );

      await Promise.all(
        signatures.map((signature) =>
          solConnection.confirmTransaction(signature, "confirmed")
        )
      );

      const listedNftsArray = createListedNftsArray(req.body.listData);
      const activityDataArray = createActivityDataArray(req.body.listData);

      await ListedNfts.create(listedNftsArray);
      const createdListings = await ActivityData.create(activityDataArray);

      res.send(createdListings);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Some error occurred while creating the ListedNfts.",
      });
    }
  }

  async findOne(req: Request, res: Response): Promise<void> {
    const { mintAddr } = req.params;
    try {
      const data = await ListedNfts.findOne({ mintAddr });
      if (!data) {
        res
          .status(404)
          .send({ message: "Not found ListedNfts with walletAddr and seller" });
      } else {
        res.send(data);
      }
    } catch (err) {
      res.status(500).send({
        message: "Error retrieving ListedNfts with walletAddr and seller",
      });
    }
  }

  async findAllBySeller(req: Request, res: Response): Promise<void> {
    try {
      const seller = req.params.id;
      const data = await ListedNfts.find({ seller });
      res.send(data);
    } catch (err: any) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ListedNfts.",
      });
    }
  }

  async findByCollectionAddr(req: Request, res: Response): Promise<void> {
    try {
      const collectionAddr = req.params.id;
      const data = await ListedNfts.find({ collectionAddr });
      res.send(data);
    } catch (err: any) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ListedNfts.",
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await ListedNfts.find({});
      if (!data || data.length === 0) {
        res.status(404).send({ message: "No ListedNfts found" });
      } else {
        res.send(data);
      }
    } catch (err: any) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ListedNfts.",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { transaction, updateData, mintAddr } = req.body;

    try {
      const txId = await sendTransaction(transaction);
      await solConnection.confirmTransaction(txId, "finalized");

      const now = Date.now();
      const updatedListedNft = await ListedNfts.findOneAndUpdate(
        { mintAddr },
        {
          solPrice: updateData.solPrice,
          tokenPrice: updateData.tokenPrice,
          createdAt: now,
          ...(updateData.solPrice !== undefined && {
            lastSolPriceChangeAt: now,
          }),
          ...(updateData.tokenPrice !== undefined && {
            lastTokenPriceChangeAt: now,
          }),
          updatedAt: now,
        }
      );

      if (!updatedListedNft) {
        res.status(404).send({
          message: `Cannot update ListedNfts. Maybe ListedNfts was not found!`,
        });
      }

      const createdListings = await ActivityData.create({
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
    } catch (error: any) {
      console.error(error);
      res.status(500).send({
        message: "Some error occurred while updating the price",
        error: error.message,
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const mintAddr = req.params.mintAddr;

    try {
      const data = await ListedNfts.findOneAndDelete({ mintAddr });
      if (!data) {
        res.status(404).send({
          message: `Cannot delete ListedNfts with mintAddr=${mintAddr}. Maybe ListedNfts was not found!`,
        });
      } else {
        res.send({ message: "ListedNfts was deleted successfully!" });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete ListedNfts with mintAddr=${mintAddr}`,
      });
    }
  }

  async deleteListedNfts(req: Request, res: Response): Promise<void> {
    const { transactions: txs, delistData, mintAddrArray } = req.body;

    try {
      const signatures = await Promise.all(
        txs.map((tx: Transaction) => sendTransaction(tx))
      );

      await Promise.all(
        signatures.map((signature) =>
          solConnection.confirmTransaction(signature, "confirmed")
        )
      );

      const deleteResult = await ListedNfts.deleteMany({
        mintAddr: { $in: mintAddrArray },
      });

      const offerUpdateData = await OfferData.updateMany(
        { mintAddr: { $in: mintAddrArray } },
        { $set: { active: 0 } }
      );

      if (!offerUpdateData) {
        res.status(404).send({
          message: `Cannot update OfferData with mintAddr=${mintAddrArray}. Maybe ListedData was not found!`,
        });
      }

      if (deleteResult.deletedCount === 0) {
        res.status(404).send({
          message: `Cannot delete ListedNfts with mintAddrs=${mintAddrArray}. Maybe they were not found.`,
        });
      }

      const activityDataArray = createActivityDataArray(delistData);
      await ActivityData.create(activityDataArray);

      res.status(200).send({
        message: `ListedNfts with mintAddrs=${mintAddrArray} were deleted successfully!`,
        count: deleteResult.deletedCount,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Could not delete ListedNfts with mintAddrs=${mintAddrArray}`,
      });
    }
  }

  // Delete a ListedNfts with the specified mintAddr in the request
  async purchaseListedNfts(req: Request, res: Response): Promise<void> {
    const { transaction: txs, purchaseData, mintAddrArray } = req.body;

    try {
      let signatures = await Promise.all(
        txs.map((tx: Transaction) => sendTransaction(tx))
      );

      await Promise.all(
        signatures.map((signature) =>
          solConnection.confirmTransaction(signature, "confirmed")
        )
      );

      // Delete listed NFTs from database
      const deleteResult = await ListedNfts.deleteMany({
        mintAddr: { $in: mintAddrArray },
      });

      // Update all offers where `mintAddr` is same and `buyer` is different
      const offerUpdateData = await OfferData.updateMany(
        { mintAddr: { $in: mintAddrArray } },
        { $set: { active: 0 } }
      );

      if (!offerUpdateData) {
        res.status(404).send({
          message: `Cannot update OfferData with mintAddr=${mintAddrArray}. Maybe ListedData was not found!`,
        });
      }

      if (deleteResult.deletedCount === 0) {
        res.status(404).send({
          message: `Cannot delete ListedNfts with mintAddrs=${mintAddrArray}. Maybe they were not found.`,
        });
      }

      // Save activity data to database
      const activityDataArray = createActivityDataArray(purchaseData);
      await ActivityData.create(activityDataArray);

      // Return success response
      res.status(200).send({
        message: `ListedNfts with mintAddrs=${mintAddrArray} were deleted successfully!`,
        count: deleteResult.deletedCount,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Could not delete ListedNfts with mintAddrs=${mintAddrArray}`,
      });
    }
  }

  // Delete all ListedNfts from the database.
  async deleteAll(req: Request, res: Response): Promise<void> {
    ListedNfts.deleteMany({})
      .then((data) => {
        res.send({
          message: `${data.deletedCount} ListedNfts were deleted successfully!`,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all ListedNfts.",
        });
      });
  }
}

export default new ListedNftsController();
