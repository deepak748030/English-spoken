// src/routes/userRoutes.js
import express from 'express';
import { blockUser, getUsers, loginOrRegister, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/loginOrRegister', loginOrRegister);
router.patch('/:id', updateUser);
router.get('/', getUsers)
router.patch('/:id/block', blockUser);
export default router;