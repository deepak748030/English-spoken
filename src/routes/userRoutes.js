// src/routes/userRoutes.js
import express from 'express';
import { loginOrRegister, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/loginOrRegister', loginOrRegister);
router.patch('/:id', updateUser);

export default router;