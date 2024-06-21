import express from "express";
import {
  getAllStudent,
  addUserAndStudent,
} from "../controllers/Student/student.js";

const router = express.Router();
router.get("/", getAllStudent);
router.post("/", addUserAndStudent);

export default router;
