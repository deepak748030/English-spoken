// src/controllers/settingsController.js
import Settings from '../models/settingsModel.js';
import logger from '../config/logger.js';
import { sendResponse } from '../utils/response.js';

export const upsertSettings = async (req, res, next) => {
    try {
        const { maintenance, termsAndConditions, privacyPolicy } = req.body;
        const updateData = {};
        if (maintenance !== undefined) updateData.maintenance = maintenance;
        if (termsAndConditions !== undefined) updateData.termsAndConditions = termsAndConditions;
        if (privacyPolicy !== undefined) updateData.privacyPolicy = privacyPolicy;

        const settings = await Settings.findOneAndUpdate(
            {}, // Empty filter to match any existing settings document
            { $set: updateData },
            { upsert: true, new: true, runValidators: true }
        );
        logger.info(`Settings ${settings.isNew ? 'created' : 'updated'}`);
        sendResponse(res, 200, `Settings ${settings.isNew ? 'created' : 'updated'}`, settings);
    } catch (err) { next(err); }
};

export const getSettings = async (req, res, next) => {
    try {
        const settings = await Settings.findOne({});
        if (!settings) {
            return sendResponse(res, 404, 'Settings not found');
        }
        sendResponse(res, 200, 'Settings fetched successfully', settings);
    } catch (err) {
        next(err);
    }
};