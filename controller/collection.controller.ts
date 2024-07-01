import { Request, Response } from "express";
import CollectionData from "../model/collection.model";

class CollectionController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body.data;
      // Check if the collection with the given address already exists
      const existingCollection = await CollectionData.findOne({
        collectionAddr: data.collectionAddr,
      });

      if (existingCollection) {
        // Update the existing user
        existingCollection.set(data);
        const updatedData = await existingCollection.save();
        console.log("Collection data updated successfully!");
        res.status(201).json({
          message: "User created successfully",
          type: "success",
          data: updatedData,
        });
      } else {
        // Create a new user
        const newUser = new CollectionData(data);
        const updatedData = await newUser.save();
        res.status(201).json({
          message: "User created successfully",
          type: "success",
          data: updatedData,
        });
        console.log("Collection data saved successfully!");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Some error occurred while creating the collection.",
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await CollectionData.find({});
      if (!data || data.length === 0) {
        res.status(404).send({ message: "No Collections found" });
      } else {
        res.send(data);
      }
    } catch (err: any) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving collection data.",
      });
    }
  }

  // async findOne(req: Request, res: Response): Promise<void> {
  //   const { mintAddr } = req.params;
  //   try {
  //     const data = await ListedNfts.findOne({ mintAddr });
  //     if (!data) {
  //       res
  //         .status(404)
  //         .send({ message: "Not found ListedNfts with walletAddr and seller" });
  //     } else {
  //       res.send(data);
  //     }
  //   } catch (err) {
  //     res.status(500).send({
  //       message: "Error retrieving ListedNfts with walletAddr and seller",
  //     });
  //   }
  // }

  // async findAllBySeller(req: Request, res: Response): Promise<void> {
  //   try {
  //     const seller = req.params.id;
  //     const data = await ListedNfts.find({ seller });
  //     res.send(data);
  //   } catch (err: any) {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving ListedNfts.",
  //     });
  //   }
  // }

  // async findByCollectionAddr(req: Request, res: Response): Promise<void> {
  //   try {
  //     const collectionAddr = req.params.id;
  //     const data = await ListedNfts.find({ collectionAddr });
  //     res.send(data);
  //   } catch (err: any) {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving ListedNfts.",
  //     });
  //   }
  // }

  // async update(req: Request, res: Response): Promise<void> {
  //   const { transaction, updateData, mintAddr } = req.body;

  //   try {
  //     const txId = await sendTransaction(transaction);
  //     await solConnection.confirmTransaction(txId, "finalized");

  //     const now = Date.now();
  //     const updatedListedNft = await ListedNfts.findOneAndUpdate(
  //       { mintAddr },
  //       {
  //         solPrice: updateData.solPrice,
  //         tokenPrice: updateData.tokenPrice,
  //         createdAt: now,
  //         ...(updateData.solPrice !== undefined && {
  //           lastSolPriceChangeAt: now,
  //         }),
  //         ...(updateData.tokenPrice !== undefined && {
  //           lastTokenPriceChangeAt: now,
  //         }),
  //         updatedAt: now,
  //       }
  //     );

  //     if (!updatedListedNft) {
  //       res.status(404).send({
  //         message: `Cannot update ListedNfts. Maybe ListedNfts was not found!`,
  //       });
  //     }

  //     const createdListings = await ActivityData.create({
  //       imgUrl: updateData.imgUrl,
  //       tokenId: updateData.tokenId,
  //       mintAddr: updateData.mintAddr,
  //       txType: updateData.txType,
  //       solPrice: updateData.solPrice,
  //       tokenPrice: updateData.tokenPrice,
  //       seller: updateData.seller,
  //       buyer: updateData.buyer,
  //     });

  //     res.send({
  //       message: "ListedNfts was updated successfully.",
  //       data: createdListings,
  //     });
  //   } catch (error: any) {
  //     console.error(error);
  //     res.status(500).send({
  //       message: "Some error occurred while updating the price",
  //       error: error.message,
  //     });
  //   }
  // }

  // async delete(req: Request, res: Response): Promise<void> {
  //   const mintAddr = req.params.mintAddr;

  //   try {
  //     const data = await ListedNfts.findOneAndDelete({ mintAddr });
  //     if (!data) {
  //       res.status(404).send({
  //         message: `Cannot delete ListedNfts with mintAddr=${mintAddr}. Maybe ListedNfts was not found!`,
  //       });
  //     } else {
  //       res.send({ message: "ListedNfts was deleted successfully!" });
  //     }
  //   } catch (err) {
  //     res.status(500).send({
  //       message: `Could not delete ListedNfts with mintAddr=${mintAddr}`,
  //     });
  //   }
  // }

  // // Delete all ListedNfts from the database.
  // async deleteAll(req: Request, res: Response): Promise<void> {
  //   ListedNfts.deleteMany({})
  //     .then((data) => {
  //       res.send({
  //         message: `${data.deletedCount} ListedNfts were deleted successfully!`,
  //       });
  //     })
  //     .catch((err) => {
  //       res.status(500).send({
  //         message:
  //           err.message || "Some error occurred while removing all ListedNfts.",
  //       });
  //     });
  // }
}

export default new CollectionController();
