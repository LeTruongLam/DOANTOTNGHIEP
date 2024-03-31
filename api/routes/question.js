import express from "express";
import { addListQuestion } from "../controllers/Question/question.js";

const router = express.Router();

router.post("/", addListQuestion);

export default router;
