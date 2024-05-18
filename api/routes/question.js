import express from "express";
import {
  addListQuestion,
  getListQuestionByChapterId,
  deleteListQuestion,
  updateQuestion,
  getQuestionById,
} from "../controllers/Question/question.js";
import {
  addExam,
  getExam,
  getExamById,
  ResultExams,
} from "../controllers/Question/exam.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.post("/course/:courseId", authorize, addListQuestion);
router.get("/chapters/:chapterId", authorize, getListQuestionByChapterId);
router.delete("/chapters/:chapterId", authorize, deleteListQuestion);
router.put("/:questionId", authorize, updateQuestion);
router.get("/:questionId", authorize, getQuestionById);

router.post("/exam/:courseId", addExam);
router.get("/exams/:courseId", getExam);
router.get("/exam/:examId", getExamById);
router.post("/exam/:examId/results", authorize, ResultExams);

export default router;
