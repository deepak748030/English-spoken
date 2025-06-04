
// controllers/premiumController.js
import Premium from "../models/premiumModel.js";
import { sendResponse } from "../utils/response.js";

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


export const updatePremium = async (req, res) => {
    try {
        const {
            courseIds,
            ebookIds,
            ...rest
        } = req.body;

        const updateData = {
            ...rest,
            ...(courseIds && { courses: courseIds }),
            ...(ebookIds && { ebooks: ebookIds }),
        };

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


export const getAllPremiums = async (_, res) => {
    try {
        const premiums = await Premium.find()
            .populate("courseIds", "title")
            .populate("ebookIds", "title");
        sendResponse(res, 200, "Premium plans fetched", premiums);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to fetch premium plans");
    }
};

export const getPremiumById = async (req, res) => {
    try {
        const premium = await Premium.findById(req.params.id)
            .populate("courses", "title")
            .populate("ebooks", "title");
        if (!premium) return sendResponse(res, 404, "Premium plan not found");
        sendResponse(res, 200, "Premium plan fetched", premium);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Failed to fetch premium plan");
    }
};

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
