import Premium from "../models/premiumModel.js";
import { sendResponse } from "../utils/response.js";

// ✅ Create Premium Plan
export const createPremium = async (req, res) => {
    try {
        const premium = new Premium(req.body);
        await premium.save();
        sendResponse(res, 201, "Premium plan created", premium);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to create premium plan");
    }
};

// ✅ Update Premium Plan
export const updatePremium = async (req, res) => {
    try {
        const {
            courseIds,
            ebookIds,
            oneMonthRazorpayId,
            threeMonthRazorpayId,
            sixMonthRazorpayId,
            twelveMonthRazorpayId,
            ...rest
        } = req.body;

        const updateData = {
            ...rest,
        };

        // Optional Razorpay plan ID updates
        if (oneMonthRazorpayId !== undefined) updateData.oneMonthRazorpayId = oneMonthRazorpayId;
        if (threeMonthRazorpayId !== undefined) updateData.threeMonthRazorpayId = threeMonthRazorpayId;
        if (sixMonthRazorpayId !== undefined) updateData.sixMonthRazorpayId = sixMonthRazorpayId;
        if (twelveMonthRazorpayId !== undefined) updateData.twelveMonthRazorpayId = twelveMonthRazorpayId;

        // ✅ Always update courseIds and ebookIds even if empty
        if ("courseIds" in req.body) updateData.courseIds = courseIds;
        if ("ebookIds" in req.body) updateData.ebookIds = ebookIds;

        const updated = await Premium.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updated) return sendResponse(res, 404, "Premium plan not found");

        sendResponse(res, 200, "Premium plan updated", updated);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to update premium plan");
    }
};

// ✅ Get All Premium Plans
export const getAllPremiums = async (_, res) => {
    try {
        const premiums = await Premium.find()
            .populate("courseIds")
            .populate("ebookIds");

        sendResponse(res, 200, "Premium plans fetched", premiums);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to fetch premium plans");
    }
};

// ✅ Get Single Premium Plan by ID
export const getPremiumById = async (req, res) => {
    try {
        const premium = await Premium.findById(req.params.id)
            .populate("courseIds")
            .populate("ebookIds");

        if (!premium) return sendResponse(res, 404, "Premium plan not found");

        sendResponse(res, 200, "Premium plan fetched", premium);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to fetch premium plan");
    }
};

// ✅ Delete Premium Plan
export const deletePremium = async (req, res) => {
    try {
        const deleted = await Premium.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Premium plan not found");
        sendResponse(res, 200, "Premium plan deleted");
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to delete premium plan");
    }
};
