import TranslationExercise from '../models/translationExerciseModel.js';
import { sendResponse } from '../utils/response.js';

export const createTranslationExercise = async (req, res) => {
    try {
        const exercise = await TranslationExercise.create(req.body);
        sendResponse(res, 201, 'Translation exercise created', exercise);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getTranslationExercises = async (req, res) => {
    try {
        const exercises = await TranslationExercise.find();
        sendResponse(res, 200, 'Translation exercises fetched', exercises);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getTranslationExercisesBySubCategory = async (req, res) => {
    try {
        const exercises = await TranslationExercise.find({ subCategoryId: req.params.subCategoryId });
        sendResponse(res, 200, 'Exercises fetched by subCategoryId', exercises);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updateTranslationExercise = async (req, res) => {
    try {
        const exercise = await TranslationExercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendResponse(res, 200, 'Translation exercise updated', exercise);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const deleteTranslationExercise = async (req, res) => {
    try {
        await TranslationExercise.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Translation exercise deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
