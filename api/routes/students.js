import express from "express";
import { getAllStudent } from "../controllers/Student/student.js";

const router = express.Router();
router.get("/", getAllStudent);

export default router;
