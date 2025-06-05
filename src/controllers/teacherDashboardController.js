import TeacherCourseOrder from '../models/TeacherCourseOrderModel.js';
import Teacher from '../models/teacherModel.js';
import PrizeCourse from '../models/prizeCourseModel.js';
import moment from 'moment';
import { sendResponse } from '../utils/response.js';

export const getTeacherDashboard = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { filter } = req.query; // 'daily', 'weekly', 'monthly', 'all'

        const now = moment();
        let startDate;

        // Set date filter
        if (filter === 'daily') {
            startDate = now.clone().startOf('day');
        } else if (filter === 'weekly') {
            startDate = now.clone().startOf('isoWeek');
        } else if (filter === 'monthly') {
            startDate = now.clone().startOf('month');
        } else {
            startDate = null; // all time
        }

        const matchQuery = {
            teacherId,
            status: 'active',
            paymentStatus: 'completed'
        };

        if (startDate) {
            matchQuery.createdAt = { $gte: startDate.toDate(), $lte: now.toDate() };
        }

        // Get teacher info
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return sendResponse(res, 404, 'Teacher not found');

        const commissionPercentage = teacher.commission;

        // Get all orders
        const orders = await TeacherCourseOrder.find(matchQuery).populate({
            path: 'courseId',
            model: 'Course',
            select: 'title teacherId'
        });

        let totalSales = 0;
        let totalRevenue = 0;
        let totalCommission = 0;

        for (const order of orders) {
            const course = order.courseId;
            if (!course) continue;

            // Ensure this course belongs to the teacher
            if (String(course.teacherId) !== String(teacherId)) continue;

            // Get course price from PrizeCourse
            const prize = await PrizeCourse.findOne({ courseId: course._id });

            const coursePrice = prize?.withDiscountPrize || 0;

            totalRevenue += coursePrice;
            totalCommission += (coursePrice * commissionPercentage) / 100;
            totalSales++;
        }

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
