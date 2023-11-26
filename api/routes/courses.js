import express from "express";
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
  getAllCourses,
  updateCourseTitle,
  updateCourseDate,
  updateCourseDesc
} from "../controllers/Course/course.js";
import {
  getAllChapter,
  addChapter,
  deleteChapter,
  editChapter,
  getChapterById,

  getChapterTitle,
  updateChapterTitle,
  insertChapterTitle,
  getChapterDesc,
  updateChapterDesc
} from "../controllers/Course/chapter.js";

import {getLessons ,addLessonTitle} from "../controllers/Course/lesson.js"
const router = express.Router();

router.get("/", getCourses);
router.get("/all", getAllCourses);
router.get("/:id", getCourse);
router.post("/", addCourse);
router.delete("/:id", deleteCourse);
router.put("/:id", updateCourse);
router.put("/title/:id", updateCourseTitle);
router.put("/date/:id", updateCourseDate);
router.put("/desc/:id", updateCourseDesc);




router.get("/:id/chapters", getAllChapter);
router.post("/:id/chapters", addChapter);
router.put("/:id/chapters", editChapter);
router.delete("/:chapterId/chapters/", deleteChapter);

router.get("/:courseId/chapters/:chapterId", getChapterById);
router.post("/chapters/title", insertChapterTitle);
router.get("/chapters/title/:chapterId", getChapterTitle);
router.put("/chapters/title/:chapterId", updateChapterTitle);

router.get("/chapters/desc/:chapterId", getChapterDesc);
router.put("/chapters/desc/:chapterId", updateChapterDesc);



router.get("/chapters/:chapterId/lessons", getLessons);
router.post("/chapters/lessons", addLessonTitle);











export default router;
