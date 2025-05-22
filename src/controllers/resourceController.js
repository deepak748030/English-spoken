import Resource from '../models/resourceModel.js';
import { sendResponse } from '../utils/response.js';

export const createResource = async (req, res) => {
    try {
        const { topicContentId, title, url, authorName, description } = req.body;
        if (!topicContentId || !title || !url || !authorName || !description) {
            return sendResponse(res, 400, "All fields are required");
        }

        const newResource = await Resource.create({ topicContentId, title, url, authorName, description });
        sendResponse(res, 201, "Resource created successfully", newResource);
    } catch (error) {
        sendResponse(res, 500, "Error creating resource");
    }
};

export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        sendResponse(res, 200, "Resources fetched successfully", resources);
    } catch (error) {
        sendResponse(res, 500, "Error fetching resources");
    }
};

export const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.find({ topicContentId: req.params.id });
        if (!resource) return sendResponse(res, 404, "Resource not found");
        sendResponse(res, 200, "Resource found", resource);
    } catch (error) {
        sendResponse(res, 500, "Error fetching resource");
    }
};

export const updateResource = async (req, res) => {
    try {
        const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "Resource not found");
        sendResponse(res, 200, "Resource updated", updated);
    } catch (error) {
        sendResponse(res, 500, "Error updating resource");
    }
};

export const deleteResource = async (req, res) => {
    try {
        const deleted = await Resource.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Resource not found");
        sendResponse(res, 200, "Resource deleted");
    } catch (error) {
        sendResponse(res, 500, "Error deleting resource");
    }
};
