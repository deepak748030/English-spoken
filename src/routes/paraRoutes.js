import express from 'express';
import {
    createPara,
    getAllParas,
    getParaById,
    updatePara,
    deletePara
} from '../controllers/paraController.js';

const router = express.Router();

router.post('/paras', createPara);
router.get('/paras', getAllParas);
router.get('/paras/:id', getParaById);
router.patch('/paras/:id', updatePara);
router.delete('/paras/:id', deletePara);

export default router;
