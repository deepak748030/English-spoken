import Topic from '../models/topicCourseModel.js';
import { sendResponse } from '../utils/response.js';

export const createTopic = async (req, res) => {
    try {
        let data = req.body;
        console.log(req.body);
        // Handle file uploads
        if (req.files) {
            if (req.files.topicNotes && req.files.topicNotes[0]) {
                data.topicNotes = process.env.IMG_URL + req.files.topicNotes[0].filename;
            }
            if (req.files.practiceQuestion && req.files.practiceQuestion[0]) {
                data.practiceQuestion = process.env.IMG_URL + req.files.practiceQuestion[0].filename;
            }
        }

        const topic = await Topic.create(data);
        sendResponse(res, 201, 'Topic created', topic);
    } catch (err) {
        console.log(err);
        sendResponse(res, 500, err.message);
    }
};

export const getTopics = async (req, res) => {
    try {
        const topics = await Topic.find();
        sendResponse(res, 200, 'Topics fetched', topics);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const updateTopic = async (req, res) => {
    try {
        let data = req.body;

        // Handle file uploads
        if (req.files) {
            if (req.files.topicNotes && req.files.topicNotes[0]) {
                data.topicNotes = process.env.IMG_URL + req.files.topicNotes[0].filename;
            }
            if (req.files.practiceQuestion && req.files.practiceQuestion[0]) {
                data.practiceQuestion = process.env.IMG_URL + req.files.practiceQuestion[0].filename;
            }
        }

        const topic = await Topic.findByIdAndUpdate(req.params.id, data, { new: true });
        sendResponse(res, 200, 'Topic updated', topic);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const deleteTopic = async (req, res) => {
    try {
        await Topic.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Topic deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getTopicsByLessonId = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const topics = await Topic.find({ lessonId });
        sendResponse(res, 200, 'Topics fetched by lessonId', topics);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};