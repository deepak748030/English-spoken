import express from 'express';
import {
    createPrize,
    getPrizes,
    updatePrize,
    deletePrize,
    getPrizeByCourseId
} from '../controllers/prizeCourseController.js';

const prizeRouter = express.Router();

prizeRouter.post('/prize', createPrize);
prizeRouter.get('/prizes', getPrizes);
prizeRouter.patch('/prize/:id', updatePrize);
prizeRouter.delete('/prize/:id', deletePrize);
prizeRouter.get('/prize/:courseId', getPrizeByCourseId);


export default prizeRouter;