import express from "express";
import {
  addClassCourse,
  getClassCourse,
  getClassStudent,
  addClassStudent,
} from "../controllers/Class/class.js";
const router = express.Router();
// lấy toàn bộ lớp học của 1 môn học
router.get("/:courseId", getClassCourse);
// thêm lớp học
router.post("/:courseId", addClassCourse);
// Thêm sinh viên vào lớp học
router.post("/class/student", addClassStudent);
router.get("/:courseId/class/:classCode", getClassStudent);
// Lấy danh sách lớp của môn học theo mã lớp
router.get("/:courseId/classes/:classId", getClassStudent);

export default router;
