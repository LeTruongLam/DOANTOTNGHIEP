import express from "express";
import {
  getAllStudent,
  addUserAndStudent,
  getStudentPersonalInformation,
  uploadAvatarToCloudinary,
} from "../controllers/Student/student.js";
import { authorize } from "../middlewares/authorize.js";
import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const router = express.Router();
router.get("/", getAllStudent);
router.post("/", addUserAndStudent);
router.get("/personal-infor", authorize, getStudentPersonalInformation);
router.put(
  "/personal-infor",
  authorize,
  upload.single("image"),
  uploadAvatarToCloudinary,
  
);

export default router;
