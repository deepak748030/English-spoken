// routes/premiumRoutes.js
import express from "express";
import {
    createPremium,
    updatePremium,
    getAllPremiums,
    getPremiumById,
    deletePremium,
} from "../controllers/premiumController.js";
import { renewPremiumSubscription } from "../controllers/premiumOrderController.js";

const router = express.Router();

router.post("/", createPremium);
router.patch("/:id", updatePremium);
router.get("/", getAllPremiums);
router.get("/:id", getPremiumById);
router.delete("/:id", deletePremium);
router.post('/renew', renewPremiumSubscription);

export default router;