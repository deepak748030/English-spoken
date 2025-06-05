import TeacherCourseOrder from '../models/TeacherCourseOrderModel.js';
import Teacher from '../models/teacherModel.js';
import moment from 'moment';
import { sendResponse } from '../utils/response.js';

export const getTeacherDashboard = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { filter } = req.query; // 'daily', 'weekly', 'monthly', 'all'

        let startDate;
        const now = moment();

        // Set filter range
        if (filter === 'daily') {
            startDate = now.clone().startOf('day');
        } else if (filter === 'weekly') {
            startDate = now.clone().startOf('isoWeek');
        } else if (filter === 'monthly') {
            startDate = now.clone().startOf('month');
        } else {
            startDate = null; // no filter
        }

        // Build match query
        const matchQuery = {
            teacherId,
            status: 'active',
            paymentStatus: 'completed'
        };

        if (startDate) {
            matchQuery.createdAt = { $gte: startDate.toDate(), $lte: now.toDate() };
        }

        // Get teacher's commission percentage
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return sendResponse(res, 404, 'Teacher not found');

        const commissionPercentage = teacher.commission;

        // Get orders
        const orders = await TeacherCourseOrder.find(matchQuery).populate({
            path: 'courseId',
            select: 'price'
        });

        let totalSales = orders.length;
        let totalRevenue = 0;
        let totalCommission = 0;

        orders.forEach(order => {
            const coursePrice = order.courseId?.price || 0;
            totalRevenue += coursePrice;
            totalCommission += (coursePrice * commissionPercentage) / 100;
        });

        sendResponse(res, 200, 'Teacher dashboard data', {
            totalRevenue,
            totalSales,
            totalCommission
        });
    } catch (err) {
        console.error(err);
        sendResponse(res, 500, err.message);
    }
};
