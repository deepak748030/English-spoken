import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendResponse } from '../utils/response.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return sendResponse(res, 400, 'Username and password are required');
        }

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return sendResponse(res, 404, 'Admin not found');
        }

        if (admin.password !== password) {
            return sendResponse(res, 401, 'Invalid credentials');
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...adminData } = admin.toObject();

        return sendResponse(res, 200, 'Login successful', {
            token,
            admin: adminData
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return sendResponse(res, 500, 'Server error');
    }
};
