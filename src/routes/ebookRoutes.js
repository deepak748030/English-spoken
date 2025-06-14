import express from 'express';
import upload from '../middleware/multer.js';
import {
    createEbook,
    getAllEbooks,
    updateEbook,
    deleteEbook,
    getEbooksByTeacher
} from '../controllers/ebookController.js';

const ebookRouter = express.Router();

// Create Ebook with multiple file upload fields (image + 2 pdfs)
ebookRouter.post(
    "/ebooks",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "demoPdf", maxCount: 1 },
        { name: "originalPdf", maxCount: 1 },
    ]),
    createEbook
);

ebookRouter.get("/ebooks", getAllEbooks);
ebookRouter.get("/ebooks/teacher/:teacherId", getEbooksByTeacher);
// Update Ebook
ebookRouter.patch(
    "/ebooks/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "demoPdf", maxCount: 1 },
        { name: "originalPdf", maxCount: 1 },
    ]),
    updateEbook
);


ebookRouter.delete('/ebooks/:id', deleteEbook);

export default ebookRouter;
