import { Application, Router } from "express";
import ListedNftsController from "../controller/listednfts.controller";

const router: Router = Router();

// Create a new listed data
router.post("/create", ListedNftsController.create);

// Retrieve all listed data by seller
router.get("/findAllBySeller/:id", ListedNftsController.findAllBySeller);

// Retrieve all listed data by collection address
router.get(
  "/findByCollectionAddr/:id",
  ListedNftsController.findByCollectionAddr
);

// Retrieve a single listed data by mint address
router.get("/:mintAddr", ListedNftsController.findOne);

// Retrieve all listed data
router.get("/", ListedNftsController.findAll);

// Update a listed data
router.put("/", ListedNftsController.update);

// Delete a listed data by mint address
router.delete("/deletewithmintaddr/:mintAddr", ListedNftsController.delete);

// Delete listed data with array
router.delete("/", ListedNftsController.deleteListedNfts);

// Delete listed data with array to purchase
router.delete("/purchase", ListedNftsController.purchaseListedNfts);

// Delete all listed data
router.delete("/deleteall", ListedNftsController.deleteAll);

export default router;
