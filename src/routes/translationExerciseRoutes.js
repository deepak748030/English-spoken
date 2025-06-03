import express from "express";
import {
    createTranslationExercise,
    getAllTranslationExercises,
    updateTranslationExercise,
    deleteTranslationExercise,
    getTranslationExerciseBySubCategoryId,
} from "../controllers/translationExerciseController.js";

const router = express.Router();

router.post("/", createTranslationExercise);
router.get("/", getAllTranslationExercises);
router.get("/subcategory/:id", getTranslationExerciseBySubCategoryId);
router.put("/:id", updateTranslationExercise);
router.delete("/:id", deleteTranslationExercise);

export default router;
