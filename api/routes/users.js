import express from "express";
import {
  getInfo,
  updateInfo,
  getAccountStudent,
  getAccountTeacher,
} from "../controllers/user.js";
import { authorize } from "../middlewares/authorize.js";
import { deleteAccountStudent } from "../controllers/Student/student.js";

const router = express.Router();

router.get("/", getInfo);
router.put("/", updateInfo);
router.get("/manage-accounts/students", getAccountStudent);
router.get("/manage-accounts/teachers", getAccountTeacher);

router.delete("/delete/students", authorize, deleteAccountStudent);

export default router;
