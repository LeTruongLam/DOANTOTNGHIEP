import express from "express";
import {
  addListQuestion,
  getListQuestionByChapterId,
} from "../controllers/Question/question.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.post("/course/:courseId", authorize, addListQuestion);
router.get("/chapters/:chapterId", authorize, getListQuestionByChapterId);

export default router;
