import UserMinutesSummary from '../models/userMinutesSummaryModel.js';
import UserMinutes from '../models/usersMinutesModel.js';
import AudioVideoOrder from '../models/AudioVideoOrderModel.js';
import { sendResponse } from '../utils/response.js';

// ✅ Get Summary, User Minutes, and Active AudioVideoOrder by User ID
export const getUserMinutesSummaryByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const [summary, userMinutes, audioVideoOrder] = await Promise.all([
            UserMinutesSummary.findOne({ userId }),
            UserMinutes.findOne({ userId }),
            AudioVideoOrder.findOne({ userId, status: 'active' })  // Only active order
        ]);

        if (!summary && !userMinutes && !audioVideoOrder) {
            return sendResponse(res, 404, 'No data found for user');
        }

        return sendResponse(res, 200, 'Fetched user minutes, summary, and active audio/video order', {
            summary,
            userMinutes,
            audioVideoOrder
        });
    } catch (error) {
        return sendResponse(res, 500, error.message);
    }
};
