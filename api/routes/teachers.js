import express from "express";
import {
  addUserAndTeacher,
  getTeacherPersonalInformation,
} from "../controllers/Teacher/teacher.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();
router.get("/personal-infor", authorize, getTeacherPersonalInformation);
router.post("/", addUserAndTeacher);

export default router;
