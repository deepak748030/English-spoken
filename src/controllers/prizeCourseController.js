
// controllers/prizeController.js
import Prize from '../models/prizeCourseModel.js';
import { sendResponse } from '../utils/response.js';

export const createPrize = async (req, res) => {
    try {
        const prize = await Prize.create(req.body);
        sendResponse(res, 201, 'Prize created', prize);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getPrizes = async (req, res) => {
    try {
        const prizes = await Prize.find();
        sendResponse(res, 200, 'Prizes fetched', prizes);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updatePrize = async (req, res) => {
    try {
        const prize = await Prize.findByIdAndUpdate(req.params.id, req.body, { new: true });
        sendResponse(res, 200, 'Prize updated', prize);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const deletePrize = async (req, res) => {
    try {
        await Prize.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Prize deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getPrizeByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const prize = await Prize.find({ courseId });
        if (!prize) {
            return sendResponse(res, 404, 'Prize not found');
        }
        sendResponse(res, 200, 'Prize fetched', prize);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};