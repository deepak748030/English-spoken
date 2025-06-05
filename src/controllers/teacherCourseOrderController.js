import TeacherCourseOrder from '../models/TeacherCourseOrderModel.js';
import { sendResponse } from '../utils/response.js';

// Create
export const createOrder = async (req, res) => {
    try {
        const newOrder = await TeacherCourseOrder.create(req.body);
        sendResponse(res, 201, "Order created successfully", newOrder);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get All
export const getAllOrders = async (req, res) => {
    try {
        const orders = await TeacherCourseOrder.find().populate('userId courseId teacherId');
        sendResponse(res, 200, "All orders fetched", orders);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Get by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await TeacherCourseOrder.findById(req.params.id).populate('userId courseId teacherId');
        if (!order) return sendResponse(res, 404, "Order not found");
        sendResponse(res, 200, "Order found", order);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

export const getOrdersByTeacherId = async (req, res) => {
    try {
        const orders = await TeacherCourseOrder.find({ teacherId: req.params.teacherId })
            .populate({
                path: 'userId',
                select: 'mobileNo' // ✅ Only include mobileNo
            })
            .populate({
                path: 'courseId',
                select: 'title price' // ✅ Only include title and price
            });

        sendResponse(res, 200, "Orders by teacher found", orders);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};


// Get by User ID
export const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await TeacherCourseOrder.find({ userId: req.params.userId }).populate('courseId teacherId');
        sendResponse(res, 200, "Orders by user found", orders);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Update
export const updateOrder = async (req, res) => {
    try {
        const updated = await TeacherCourseOrder.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!updated) return sendResponse(res, 404, "Order not found");
        sendResponse(res, 200, "Order updated", updated);
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};

// Delete
export const deleteOrder = async (req, res) => {
    try {
        const deleted = await TeacherCourseOrder.findByIdAndDelete(req.params.id);
        if (!deleted) return sendResponse(res, 404, "Order not found");
        sendResponse(res, 200, "Order deleted");
    } catch (err) {
        sendResponse(res, 500, err.message);
    }
};
