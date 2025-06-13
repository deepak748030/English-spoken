import express from "express";
import upload from "../middleware/multer.js"; // ✅ Import Multer middleware
import {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    teacherLogin,
} from "../controllers/teacherController.js";

const router = express.Router();

// ✅ Update POST route to handle file (form-data)
router.post("/", upload.single("profileImg"), createTeacher);

router.post('/login', teacherLogin);
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.patch("/:id", upload.single("profileImg"), updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;
