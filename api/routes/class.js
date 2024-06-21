import express from "express";
import {
  addClassCourse,
  getClassCourse,
  getClassStudent,
  addClassStudent,
  getClassStudentByClassCode,
  deleteClass,
} from "../controllers/Class/class.js";
const router = express.Router();
// lấy toàn bộ lớp học của 1 môn học
router.get("/:courseId", getClassCourse);
router.delete("/:classId", deleteClass);
// thêm lớp học
router.post("/:courseId", addClassCourse);
// Thêm sinh viên vào lớp học
// router.post("/classes/:classId", addClassStudent);

// Thêm sinh viên vào lớp học bằng excel

router.post("/:classId/importExcel", addClassStudent);

router.get("/:courseId/class/:classCode", getClassStudentByClassCode);
// Lấy danh sách lớp của môn học theo mã lớp
router.get("/:courseId/classes/:classId", getClassStudent);

export default router;
