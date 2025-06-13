import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        let admin = await Admin.findOne({ username });

        // If admin doesn't exist, create one
        if (!admin) {
            admin = new Admin({ username, password });
            await admin.save();

            // Issue JWT
            const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
                expiresIn: '7d'
            });

            return res.status(201).json({ message: 'Admin created', token, admin });
        }

        // Check password
        if (admin.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
            expiresIn: '7d'
        });

        return res.status(200).json({ message: 'Login successful', token, admin });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
