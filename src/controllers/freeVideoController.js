import FreeVideo from '../models/freeVideoModel.js';
import { sendResponse } from '../utils/response.js';

export const createFreeVideo = async (req, res) => {
    try {
        const { subCategoryId, title, url, authorName, description, type } = req.body;
        if (!subCategoryId || !title || !url || !authorName || !description) {
            return sendResponse(res, 400, "All fields are required");
        }

        const newVideo = await FreeVideo.create({ subCategoryId, title, url, authorName, description, type });
        sendResponse(res, 201, "Free video created successfully", newVideo);
    } catch (error) {
        sendResponse(res, 500, "Error creating free video");
    }
};

export const getAllFreeVideos = async (req, res) => {
    try {
        const videos = await FreeVideo.find();
        sendResponse(res, 200, "Free videos fetched successfully", videos);
    } catch (error) {
        sendResponse(res, 500, "Error fetching free videos");
    }
};

export const getFreeVideosBySubCategoryId = async (req, res) => {
    try {
        const videos = await FreeVideo.find({ subCategoryId: req.params.id });
        if (!videos || videos.length === 0) return sendResponse(res, 404, "No videos found");
        sendResponse(res, 200, "Free videos found", videos);
    } catch (error) {
        sendResponse(res, 500, "Error fetching free videos");
    }
};

export const updateFreeVideo = async (req, res) => {
    try {
        const updated = await FreeVideo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "Free video not found");
        sendResponse(res, 200, "Free video updated", updated);
    } catch (error) {
        sendResponse(res, 500, "Error updating free video");
    }
};

export const deleteFreeVideo = async (req, res) => {
    try {
        const deleted = await FreeVideo.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Free video not found");
        sendResponse(res, 200, "Free video deleted");
    } catch (error) {
        sendResponse(res, 500, "Error deleting free video");
    }
};

export const getDataByType = async (req, res) => {
    try {
        const { type } = req.params;
        if (!type) return sendResponse(res, 400, "Type parameter is required");
        const videos = await FreeVideo.find({ type });
        if (!videos || videos.length === 0) return sendResponse(res, 404, "No videos found for this type");
        sendResponse(res, 200, "Free videos found", videos);
    } catch (error) {
        sendResponse(res, 500, "Error fetching free videos by type");
    }
};