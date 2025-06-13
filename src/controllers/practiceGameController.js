import PracticeGame from '../models/practiceGameModel.js';
import { sendResponse } from '../utils/response.js';

// Utility: Clean text by removing "." and "?"
const cleanText = (input) => input.replace(/[.?]/g, '');

export const createPracticeGame = async (req, res) => {
    try {
        const { subCategory, text, question } = req.body;
        if (!subCategory || !text) {
            return sendResponse(res, 400, "subCategory and text are required");
        }

        const clean = cleanText(text);
        const newGame = await PracticeGame.create({ subCategory, text: clean, question });

        sendResponse(res, 201, "Practice game created", newGame);
    } catch (error) {
        sendResponse(res, 500, "Error creating practice game");
    }
};

export const getAllPracticeGames = async (req, res) => {
    try {
        const games = await PracticeGame.find();
        sendResponse(res, 200, "Practice games fetched", games);
    } catch (error) {
        sendResponse(res, 500, "Error fetching practice games");
    }
};

export const getPracticeGameById = async (req, res) => {
    try {
        const game = await PracticeGame.find({ subCategory: req.params.id });
        if (!game) return sendResponse(res, 404, "Game not found");
        sendResponse(res, 200, "Practice game found", game);
    } catch (error) {
        sendResponse(res, 500, "Error fetching game");
    }
};


export const updatePracticeGame = async (req, res) => {
    try {
        // Remove special characters from text, if present
        if (req.body.text) {
            req.body.text = req.body.text.replace(/[.?]/g, '');
        }

        const updated = await PracticeGame.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return sendResponse(res, 404, "Practice game not found");
        }

        sendResponse(res, 200, "Practice game updated successfully", updated);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Server error while updating game");
    }
};


export const deletePracticeGame = async (req, res) => {
    try {
        const deleted = await PracticeGame.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Game not found");

        sendResponse(res, 200, "Practice game deleted");
    } catch (error) {
        sendResponse(res, 500, "Error deleting game");
    }
};
