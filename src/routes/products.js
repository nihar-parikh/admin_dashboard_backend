import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controller/products.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyAdmin, addProduct);

router.get("/:id", getProduct);

router.get("/", getAllProducts);

router.put("/:id", verifyAdmin, updateProduct);

router.delete("/deleteproduct/:id", verifyAdmin, deleteProduct);

export default router;
