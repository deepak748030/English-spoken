import express from 'express';
import {
  blockUser,
  getUsers,
  loginOrRegister,
  updateUser,
  updatePasswordIfAlreadySet
} from '../controllers/userController.js';

const router = express.Router();

router.post('/loginOrRegister', loginOrRegister);
router.patch('/:id', updateUser);
router.get('/', getUsers);
router.patch('/:id/block', blockUser);
router.post('/set-password', updatePasswordIfAlreadySet); // ✅ Route renamed to /set-password

export default router;
