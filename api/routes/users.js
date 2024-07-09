import express from "express";
import {
  getInfo,
  updateInfo,
  getAccountStudent,
  getAccountTeacher,
} from "../controllers/user.js";
import { authorize } from "../middlewares/authorize.js";
import { deleteAccountStudent } from "../controllers/Student/student.js";
import { deleteAccountTeacher } from "../controllers/Teacher/teacher.js";

const router = express.Router();

router.get("/", getInfo);
router.put("/", updateInfo);
router.get("/manage-accounts/students", getAccountStudent);
router.get("/manage-accounts/teachers", getAccountTeacher);

router.delete("/delete/students", authorize, deleteAccountStudent);
router.delete("/delete/teachers", authorize, deleteAccountTeacher);

export default router;
