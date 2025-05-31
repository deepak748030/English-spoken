import express from 'express';
import upload from '../middleware/multer.js';
import {
    createEbook,
    getAllEbooks,
    updateEbook,
    deleteEbook,
    getEbooksByUserId,
    createEbookOrder,
    getAllOrders,
    getOrdersByUserId
} from '../controllers/ebookController.js';

const ebookRouter = express.Router();

ebookRouter.post(
    '/ebooks',
    upload.fields([
        { name: 'banner', maxCount: 1 },
        { name: 'demoPdf', maxCount: 1 },
        { name: 'originalPdf', maxCount: 1 }
    ]),
    createEbook
);

ebookRouter.get('/ebooks', getAllEbooks);
ebookRouter.get('/ebooks/user/:userId', getEbooksByUserId);
ebookRouter.patch(
    '/ebooks/:id',
    upload.fields([
        { name: 'banner', maxCount: 1 },
        { name: 'demoPdf', maxCount: 1 },
        { name: 'originalPdf', maxCount: 1 }
    ]),
    updateEbook
);
ebookRouter.delete('/ebooks/:id', deleteEbook);

// Ebook Orders
ebookRouter.post('/ebooks/order', createEbookOrder);
ebookRouter.get('/ebooks/orders', getAllOrders);
ebookRouter.get('/ebooks/orders/user/:userId', getOrdersByUserId);

export default ebookRouter;
