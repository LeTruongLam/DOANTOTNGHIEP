import express from "express";
import {
  addClassCourse,
  getClassCourse,
  getClassStudent,
  addClassStudent,
} from "../controllers/Class/class.js";
const router = express.Router();

router.get("/:courseId", getClassCourse);
router.post("/:courseId", addClassCourse);



router.post("/class/student", addClassStudent);
router.get("/:courseId/class/:classCode", getClassStudent);


export default router;
