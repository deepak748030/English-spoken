// src/controllers/topicController.js
import Topic from '../models/topicModel.js';
import { sendResponse } from '../utils/response.js';
import slugify from 'slugify';

export const createTopic = async (req, res) => {
    try {
        const { title, type } = req.body;
        if (!title || !type) {
            return sendResponse(res, 400, "Title and type are required");
        }

        const slugType = slugify(type.toLowerCase());

        const topic = await Topic.create({ title, type: slugType });
        sendResponse(res, 201, "Topic created successfully", topic);
    } catch (error) {
        sendResponse(res, 500, "Error creating topic");
    }
};

export const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.find().sort({ createdAt: -1 });
        sendResponse(res, 200, "Topics fetched successfully", topics);
    } catch (error) {
        sendResponse(res, 500, "Error fetching topics");
    }
};

export const updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type } = req.body;

        const updatedData = {};
        if (title) updatedData.title = title;
        if (type) updatedData.type = slugify(type.toLowerCase());

        const updated = await Topic.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updated) return sendResponse(res, 404, "Topic not found");

        sendResponse(res, 200, "Topic updated", updated);
    } catch (error) {
        sendResponse(res, 500, "Error updating topic");
    }
};

export const deleteTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Topic.findByIdAndDelete(id);
        if (!deleted) return sendResponse(res, 404, "Topic not found");

        sendResponse(res, 200, "Topic deleted");
    } catch (error) {
        sendResponse(res, 500, "Error deleting topic");
    }
};
