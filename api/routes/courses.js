import express from "express";
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
  getAllCourses,
} from "../controllers/Course/course.js";
import { getChapter,addChapter  } from "../controllers/Course/chapter.js";



const router = express.Router();

router.get("/", getCourses);
router.get("/all", getAllCourses);
router.get("/:id", getCourse);

router.post("/", addCourse);

router.delete("/:id", deleteCourse);

router.put("/:id", updateCourse);

router.get("/:id/chapters", getChapter);
router.post("/:id/chapters", addChapter);

export default router;
