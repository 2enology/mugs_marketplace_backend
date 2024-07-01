import { Application, Router } from "express";
import CollectionController from "../controller/collection.controller";

const router: Router = Router();

// Create a new listed data
router.post("/create", CollectionController.create);

export default router;
