// routes/communityRoutes.js
import express from 'express';
import {
    createCommunityPost,
    getCommunityPosts,
    updateCommunityPost,
    deleteCommunityPost,
    getReplyCommunityPostsByUserId,

} from '../controllers/communityController.js';

const router = express.Router();

router.post('/community', createCommunityPost);
router.get('/communities', getCommunityPosts);
router.get('/community/reply/:userId', getReplyCommunityPostsByUserId);
router.patch('/community/:id', updateCommunityPost);
router.delete('/community/:id', deleteCommunityPost);

export default router;