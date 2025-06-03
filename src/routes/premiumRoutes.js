// routes/premiumRoutes.js
import express from "express";
import {
    createPremium,
    updatePremium,
    getAllPremiums,
    getPremiumById,
    deletePremium,
} from "../controllers/premiumController.js";

const router = express.Router();

router.post("/", createPremium);
router.patch("/:id", updatePremium);
router.get("/", getAllPremiums);
router.get("/:id", getPremiumById);
router.delete("/:id", deletePremium);

export default router;