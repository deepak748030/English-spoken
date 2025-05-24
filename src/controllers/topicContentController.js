import TopicContent from '../models/topicContentModel.js';
import { sendResponse } from '../utils/response.js';
export const createTopicContent = async (req, res) => {
    try {
        const { topic, title, number, isLocked, type } = req.body;

        if (!topic || !title || number === undefined || !type) {
            return sendResponse(res, 400, "Topic, title, number, and type are required.");
        }

        const newContent = await TopicContent.create({ topic, title, number, isLocked, type });
        sendResponse(res, 201, "Topic content created successfully", newContent);
    } catch (err) {
        sendResponse(res, 500, "Error creating topic content");
    }
};

export const getAllTopicContents = async (req, res) => {
    try {
        const contents = await TopicContent.find().sort({ number: 1 });
        sendResponse(res, 200, "Topic contents fetched", contents);
    } catch (err) {
        sendResponse(res, 500, "Error fetching topic contents");
    }
};

export const getTopicContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await TopicContent.find({ topic: id });
        if (!content) return sendResponse(res, 404, "Content not found");
        sendResponse(res, 200, "Content fetched", content);
    } catch (err) {
        sendResponse(res, 500, "Error fetching content");
    }
};

export const updateTopicContent = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await TopicContent.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return sendResponse(res, 404, "Content not found");
        sendResponse(res, 200, "Content updated", updated);
    } catch (err) {
        sendResponse(res, 500, "Error updating content");
    }
};

export const deleteTopicContent = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TopicContent.findByIdAndDelete(id);
        if (!deleted) return sendResponse(res, 404, "Content not found");
        sendResponse(res, 200, "Content deleted");
    } catch (err) {
        sendResponse(res, 500, "Error deleting content");
    }
};
