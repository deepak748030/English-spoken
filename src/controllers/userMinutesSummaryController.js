import UserMinutesSummary from '../models/userMinutesSummaryModel.js';
import { sendResponse } from '../utils/response.js';

// ✅ Get Summary by User ID
export const getUserMinutesSummaryByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const summary = await UserMinutesSummary.findOne({ userId });

        if (!summary) {
            return sendResponse(res, 404, 'User minutes summary not found');
        }

        return sendResponse(res, 200, 'Fetched user minutes summary', summary);
    } catch (error) {
        return sendResponse(res, 500, error.message);
    }
};
