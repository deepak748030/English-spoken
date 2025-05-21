import Home from '../models/homeModel.js';
import { sendResponse } from '../utils/response.js';
import logger from '../config/logger.js';
import fs from 'fs';
import path from 'path';

export const createHome = async (req, res) => {
    try {
        const { title, type } = req.body;
        if (!title || !type)
            return sendResponse(res, 400, "Title and type are required");

        let imageUrl = "";
        if (req.file) {
            imageUrl = `${process.env.IMG_URL}${req.file.filename}`;
        }

        const newHome = await Home.create({ title, type, image: imageUrl });

        logger.info("Home created", { id: newHome._id });
        sendResponse(res, 201, "Home created successfully", newHome);
    } catch (error) {
        logger.error("Create error", { error: error.message });
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const getAllHomes = async (req, res) => {
    try {
        const homes = await Home.find().sort({ createdAt: -1 });
        sendResponse(res, 200, "Homes fetched successfully", homes);
    } catch (error) {
        logger.error("Fetch error", { error: error.message });
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const updateHome = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type } = req.body;

        const home = await Home.findById(id);
        if (!home) return sendResponse(res, 404, "Home not found");

        // If image updated, delete old image
        if (req.file) {
            const oldFilename = home.image.replace(process.env.IMG_URL, "");
            const oldPath = path.join('src/uploads', oldFilename);
            fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
            home.image = `${process.env.IMG_URL}${req.file.filename}`;
        }

        if (title) home.title = title;
        if (type) home.type = type;

        await home.save();
        sendResponse(res, 200, "Home updated", home);
    } catch (error) {
        logger.error("Update error", { error: error.message });
        sendResponse(res, 500, "Internal Server Error");
    }
};

export const deleteHome = async (req, res) => {
    try {
        const { id } = req.params;
        const home = await Home.findById(id);
        if (!home) return sendResponse(res, 404, "Home not found");

        // Delete image file if it exists and is a local file
        if (home.image && home.image.startsWith(process.env.IMG_URL)) {
            const filename = home.image.substring(process.env.IMG_URL.length);
            const imagePath = path.join('src/uploads', filename);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await home.deleteOne();
        sendResponse(res, 200, "Home deleted successfully");
    } catch (error) {
        logger.error("Delete error", { error: error.message });
        sendResponse(res, 500, "Internal Server Error");
    }
};
