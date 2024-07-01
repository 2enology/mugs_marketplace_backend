import { Router } from "express";
import CollectionController from "../controller/collection.controller";

const router: Router = Router();

// Create a new listed data
router.post("/create", CollectionController.create);

// Get all collection data
router.get("/", CollectionController.findAll);

export default router;
