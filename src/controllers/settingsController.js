// src/controllers/settingsController.js
import Settings from '../models/settingsModel.js';
import logger from '../config/logger.js';
import { sendResponse } from '../utils/response.js';

export const upsertSettings = async (req, res, next) => {
    try {
        const {
            maintenance,
            termsAndConditions,
            privacyPolicy,
            PerAudioMinuteCost,
            PerVideoMinuteCost,
            DailyFreeAudioMinutes,
            DailyFreeVideoMinutes,
            oneToOneClassIntroUrl,
            groupClassIntroUrl,
            trainerClassIntroUrl
        } = req.body;

        const updateData = {};

        if (maintenance !== undefined) updateData.maintenance = maintenance;
        if (termsAndConditions !== undefined) updateData.termsAndConditions = termsAndConditions;
        if (privacyPolicy !== undefined) updateData.privacyPolicy = privacyPolicy;

        if (PerAudioMinuteCost !== undefined) updateData.PerAudioMinuteCost = PerAudioMinuteCost;
        if (PerVideoMinuteCost !== undefined) updateData.PerVideoMinuteCost = PerVideoMinuteCost;
        if (DailyFreeAudioMinutes !== undefined) updateData.DailyFreeAudioMinutes = DailyFreeAudioMinutes;
        if (DailyFreeVideoMinutes !== undefined) updateData.DailyFreeVideoMinutes = DailyFreeVideoMinutes;

        if (oneToOneClassIntroUrl !== undefined) updateData.oneToOneClassIntroUrl = oneToOneClassIntroUrl;
        if (groupClassIntroUrl !== undefined) updateData.groupClassIntroUrl = groupClassIntroUrl;
        if (trainerClassIntroUrl !== undefined) updateData.trainerClassIntroUrl = trainerClassIntroUrl;

        const settings = await Settings.findOneAndUpdate(
            {}, // Match any existing settings document
            { $set: updateData },
            { upsert: true, new: true, runValidators: true }
        );

        logger.info(`Settings ${settings.isNew ? 'created' : 'updated'}`);
        sendResponse(res, 200, `Settings ${settings.isNew ? 'created' : 'updated'}`, settings);
    } catch (err) {
        next(err);
    }
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