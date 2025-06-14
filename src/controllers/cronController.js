import Settings from '../models/settingsModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import { sendResponse } from '../utils/response.js';

export const resetDailyMinutes = async (req, res) => {
    try {
        const settings = await Settings.findOne(); // Always only one settings doc
        if (!settings) return sendResponse(res, 404, 'Settings not found');

        const { DailyFreeAudioMinutes, DailyFreeVideoMinutes } = settings;

        const updated = await UserMinutes.updateMany({}, {
            $set: {
                dailyAudioMinutes: DailyFreeAudioMinutes,
                dailyVideoMinutes: DailyFreeVideoMinutes
            }
        });

        return sendResponse(res, 200, 'Daily minutes reset for all users', updated);
    } catch (err) {
        return sendResponse(res, 500, err.message);
    }
};
