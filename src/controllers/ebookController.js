import Ebook from "../models/ebookModel.js";
import EbookOrder from "../models/ebookOrderModel.js";
import { sendResponse } from "../utils/response.js";

// Create Ebook Controller
export const createEbook = async (req, res) => {
    try {
        const { title, description, rating, teacherId, price } = req.body;
        const imageFile = req.files?.image?.[0];
        const demoPdfFile = req.files?.demoPdf?.[0];
        const originalPdfFile = req.files?.originalPdf?.[0];

        if (!imageFile || !demoPdfFile || !originalPdfFile) {
            return sendResponse(res, 400, "All files are required");
        }

        const newEbook = new Ebook({
            title,
            description,
            rating,
            teacherId,
            price,
            imageUrl: `${process.env.IMG_URL}${imageFile.filename}`,
            demoPdfUrl: `${process.env.IMG_URL}${demoPdfFile.filename}`,
            originalPdfUrl: `${process.env.IMG_URL}${originalPdfFile.filename}`,
        });

        await newEbook.save();

        sendResponse(res, 201, "Ebook created", newEbook);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Server Error");
    }
};

export const updateEbook = async (req, res) => {
    try {
        const ebookId = req.params.id;
        const { title, description, rating, teacherId, price } = req.body;

        const ebook = await Ebook.findById(ebookId);
        if (!ebook) {
            return sendResponse(res, 404, "Ebook not found");
        }

        if (title) ebook.title = title;
        if (description) ebook.description = description;
        if (rating) ebook.rating = rating;
        if (teacherId) ebook.teacherId = teacherId;
        if (price) ebook.price = price;

        const imageFile = req.files?.image?.[0];
        const demoPdfFile = req.files?.demoPdf?.[0];
        const originalPdfFile = req.files?.originalPdf?.[0];

        if (imageFile) ebook.imageUrl = `${process.env.IMG_URL}${imageFile.filename}`;
        if (demoPdfFile) ebook.demoPdfUrl = `${process.env.IMG_URL}${demoPdfFile.filename}`;
        if (originalPdfFile) ebook.originalPdfUrl = `${process.env.IMG_URL}${originalPdfFile.filename}`;

        await ebook.save();

        sendResponse(res, 200, "Ebook updated", ebook);
    } catch (error) {
        console.error(error);
        sendResponse(res, 500, "Server Error");
    }
};

export const getAllEbooks = async (_, res) => {
    try {
        const ebooks = await Ebook.find().populate("teacherId", "teacherName teacherNumber");
        // const ebooks = await Ebook.find();
        sendResponse(res, 200, "All ebooks fetched", ebooks);
    } catch (error) {
        sendResponse(res, 500, "Server Error");
    }
};

export const getEbooksByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const ebooks = await Ebook.find({ teacherId }).populate("teacherId", "teacherName teacherNumber");
        // const ebooks = await Ebook.find({ teacherId });
        sendResponse(res, 200, "Ebooks by teacher fetched", ebooks);
    } catch (error) {
        sendResponse(res, 500, "Server Error");
    }
};


export const deleteEbook = async (req, res) => {
    try {
        await Ebook.findByIdAndDelete(req.params.id);
        sendResponse(res, 200, 'Ebook deleted');
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
