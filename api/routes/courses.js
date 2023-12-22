import express from "express";
import {
  addCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
  getAllCourses,
  // getCourseTitle,
  updateCourseTitle,
  updateCourseCode,
  updateCourseDate,
  updateCourseDesc,
} from "../controllers/Course/course.js";
import {
  getAllChapter,
  deleteChapter,
  getChapterById,
  getChapterTitle,
  updateChapterTitle,
  insertChapterTitle,
  getChapterDesc,
  updateChapterDesc,
  getChapterDocument,
  deleteChapterDocument,
} from "../controllers/Course/chapter.js";

import {
  getLesson,
  getLessons,
  deleteLesson,
  addLessonTitle,
  getLessonTitle,
  updateLessonTitle,
  getLessonVideo,
  getLessonDesc,
  updateLessonDesc,
} from "../controllers/Course/lesson.js";
import {
  getAssignment,
  getAssignments,
  deleteAssignment,
  addAssignmentTitle,
  getAssignmentTitle,
  updateAssignmentTitle,
  getAssignmentDesc,
  updateAssignmentDesc,
  getAssignmentDate,
  updateAssignmentDate,
  getAssignmentFile
} from "../controllers/Course/assignment.js";
const router = express.Router();

// courses
router.get("/", getCourses);
router.get("/all", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", addCourse);
router.delete("/:id", deleteCourse);
router.put("/:id", updateCourse);
// router.get("/title/:id", getCourseTitle);
router.put("/title/:id", updateCourseTitle);
router.put("/code/:id", updateCourseCode);
router.put("/date/:id", updateCourseDate);
router.put("/desc/:id", updateCourseDesc);

// chapters
router.get("/:id/chapters", getAllChapter);
router.delete("/:chapterId/chapters/", deleteChapter);

router.get("/:courseId/chapters/:chapterId", getChapterById);
router.post("/chapters/title", insertChapterTitle);
router.get("/chapters/title/:chapterId", getChapterTitle);
router.put("/chapters/title/:chapterId", updateChapterTitle);

router.get("/chapters/desc/:chapterId", getChapterDesc);
router.put("/chapters/desc/:chapterId", updateChapterDesc);

router.get("/chapters/document/:chapterId", getChapterDocument);
router.delete(
  "/chapters/:chapterId/document/:documentId",
  deleteChapterDocument
);

// lesson
router.get("/chapters/:chapterId/lessons", getLessons);
router.get("/chapters/:chapterId/lessons/:lessonId", getLesson);
router.delete("/chapters/:chapterId/lessons/:lessonId", deleteLesson);

router.get("/chapters/:chapterId/lessons/title/:lessonId", getLessonTitle);
router.put("/chapters/:chapterId/lessons/title/:lessonId", updateLessonTitle);
router.post("/chapters/lessons", addLessonTitle);
router.get("/chapters/:chapterId/lessons/video/:lessonId", getLessonVideo);
router.get("/chapters/:chapterId/lessons/desc/:lessonId", getLessonDesc);
router.put("/chapters/:chapterId/lessons/desc/:lessonId", updateLessonDesc);

// assignments
router.get("/chapters/:chapterId/assignments", getAssignments);
router.get("/chapters/:chapterId/assignments/:assignmentId", getAssignment);
router.delete(
  "/chapters/:chapterId/assignments/:assignmentId",
  deleteAssignment
);
router.get("/chapters/:chapterId/assignmentfile/:assignmentId", getAssignmentFile);

router.get(
  "/chapters/:chapterId/assignments/title/:assignmentId",
  getAssignmentTitle
);
router.put(
  "/chapters/:chapterId/assignments/title/:assignmentId",
  updateAssignmentTitle
);
router.post("/chapters/assignments", addAssignmentTitle);

router.get(
  "/chapters/:chapterId/assignments/desc/:assignmentId",
  getAssignmentDesc
);
router.put(
  "/chapters/:chapterId/assignments/desc/:assignmentId",
  updateAssignmentDesc
);
router.get(
  "/chapters/:chapterId/assignments/date/:assignmentId",
  getAssignmentDate
);
router.put(
  "/chapters/:chapterId/assignments/date/:assignmentId",
  updateAssignmentDate
);

export default router;
