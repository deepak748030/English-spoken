// src/routes/settingsRoutes.js
import express from 'express';
import { upsertSettings } from '../controllers/settingsController.js';

const router = express.Router();

router.post('/', upsertSettings);

export default router;