// src/routes/settingsRoutes.js
import express from 'express';
import { getSettings, upsertSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.post('/', upsertSettings);
router.get('/', getSettings);

export default router;