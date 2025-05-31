import express from 'express';
import {
    createFreeVideo,
    getAllFreeVideos,
    getFreeVideosBySubCategoryId,
    updateFreeVideo,
    deleteFreeVideo,
    getDataByType
} from '../controllers/freeVideoController.js';

const router = express.Router();

router.post('/free-videos', createFreeVideo);
router.get('/free-videos', getAllFreeVideos);
router.get('/free-videos/type/:type', getDataByType);
router.get('/free-videos/subcategory/:id', getFreeVideosBySubCategoryId);
router.patch('/free-videos/:id', updateFreeVideo);
router.delete('/free-videos/:id', deleteFreeVideo);

export default router;
