import Quiz from '../models/quizModel.js';
import { sendResponse } from '../utils/response.js';

export const createQuiz = async (req, res) => {
    try {
        const { subCategory, question, options, correctAnswer, type } = req.body;

        if (!subCategory || !question || !options || !correctAnswer) {
            return sendResponse(res, 400, "Missing required fields");
        }

        const newQuiz = await Quiz.create({ subCategory, question, options, correctAnswer, type });
        sendResponse(res, 201, "Quiz created", newQuiz);
    } catch (err) {
        sendResponse(res, 500, "Error creating quiz");
    }
};

export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ number: 1 });
        sendResponse(res, 200, "Quizzes fetched", quizzes);
    } catch (err) {
        sendResponse(res, 500, "Error fetching quizzes");
    }
};

export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.find({ subCategory: req.params.id });
        if (!quiz) return sendResponse(res, 404, "Quiz not found");
        sendResponse(res, 200, "Quiz fetched", quiz);
    } catch (err) {
        sendResponse(res, 500, "Error fetching quiz");
    }
};

export const updateQuiz = async (req, res) => {
    try {
        const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "Quiz not found");
        sendResponse(res, 200, "Quiz updated", updated);
    } catch (err) {
        sendResponse(res, 500, "Error updating quiz");
    }
};

export const deleteQuiz = async (req, res) => {
    try {
        const deleted = await Quiz.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Quiz not found");
        sendResponse(res, 200, "Quiz deleted");
    } catch (err) {
        sendResponse(res, 500, "Error deleting quiz");
    }
};

export const getDataByType = async (req, res) => {
    try {
        const { type } = req.params;
        if (!type) return sendResponse(res, 400, "Type parameter is required");
        const quizzes = await Quiz.find({ type });
        sendResponse(res, 200, "Quizzes fetched by type", quizzes);
    } catch (err) {
        sendResponse(res, 500, "Error fetching quizzes by type");
    }
};