import express from "express";
import {
  addClassCourse,
  getClassCourse,
  getClassStudent,
  addClassStudent,
  getClassStudentByClassCode,
  deleteClass,
  getClassById,
} from "../controllers/Class/class.js";
import { authorize } from "../middlewares/authorize.js";
const router = express.Router();
// lấy toàn bộ lớp học của 1 môn học
router.get("/:courseId", getClassCourse);

router.delete("/:classId", deleteClass);
// thêm lớp học
router.post("/:courseId",authorize, addClassCourse);
// Thêm sinh viên vào lớp học
// router.post("/:classId", addClassStudent);

// Thêm sinh viên vào lớp học bằng excel

router.post("/:classId/importExcel", addClassStudent);

// Lấy thông tin danh sách của 1 lớp
router.get("/:courseId/classes/:classId", getClassById);

router.get("/:courseId/class/:classCode", getClassStudentByClassCode);
// Lấy danh sách lớp của môn học theo mã lớp
router.get("/:courseId/classes/:classId/classStudent", getClassStudent);

export default router;
