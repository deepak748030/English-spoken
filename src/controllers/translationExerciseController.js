import TranslationExercise from "../models/translationExerciseModel.js";
import { sendResponse } from "../utils/response.js";

export const createTranslationExercise = async (req, res) => {
    try {
        const exercise = new TranslationExercise(req.body);
        await exercise.save();
        sendResponse(res, 201, "Translation exercise created", exercise);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to create translation exercise");
    }
};

export const getAllTranslationExercises = async (_, res) => {
    try {
        const exercises = await TranslationExercise.find();
        sendResponse(res, 200, "All translation exercises", exercises);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to fetch translation exercises");
    }
};

export const getTranslationExerciseBySubCategoryId = async (req, res) => {
    try {
        const exercise = await TranslationExercise.find({ subCategory: req.params.id });
        if (!exercise) return sendResponse(res, 404, "Exercise not found");
        sendResponse(res, 200, "Translation exercise found", exercise);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to fetch translation exercise");
    }
};

export const updateTranslationExercise = async (req, res) => {
    try {
        const updated = await TranslationExercise.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return sendResponse(res, 404, "Exercise not found");
        sendResponse(res, 200, "Exercise updated", updated);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to update exercise");
    }
};

export const deleteTranslationExercise = async (req, res) => {
    try {
        const deleted = await TranslationExercise.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Exercise not found");
        sendResponse(res, 200, "Exercise deleted");
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to delete exercise");
    }
};
