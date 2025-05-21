import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    createHome,
    getAllHomes,
    updateHome,
    deleteHome
} from '../controllers/homeController.js';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'src/uploads'),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Routes
router.post('/home', upload.single('image'), createHome);
router.get('/home', getAllHomes);
router.patch('/home/:id', upload.single('image'), updateHome);
router.delete('/home/:id', deleteHome);

export default router;
