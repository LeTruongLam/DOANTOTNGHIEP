import express from "express";
import {
  addCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
  getAllCourses,
  getCourseTitle,
  getCourseCode,
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
  getAssignmentFile,
  // assignmentSubmission,
  getAssignmentSubmission,
  updateReviewAssignment,
  updatePointAssignment,
  getAssignmentSubmitted,
  updateSubmissionStatus,
  insertAssignmentSubmission,
  getAllAssignmentsOfCourse,
  getAllStudentAndAssignmentStatus,
} from "../controllers/Course/assignment.js";
import { authorize } from "../middlewares/authorize.js";
const router = express.Router();

// courses
router.get("/", authorize, getCourses);
router.get("/all", authorize, getAllCourses);
router.get("/:id", authorize, getCourseById);
router.post("/", authorize, addCourse);
router.delete("/:id", authorize, deleteCourse);
router.put("/:id", authorize, updateCourse);
router.get("/title/:id", authorize, getCourseTitle);
router.put("/title/:id", updateCourseTitle);
router.get("/code/:id", getCourseCode);

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
router.get(
  "/chapters/:chapterId/assignmentfile/:assignmentId",
  getAssignmentFile
);
router.get("/assignments/:assignmentId/submission", getAssignmentSubmission);

router.get(
  "/chapters/:chapterId/assignments/title/:assignmentId",
  getAssignmentTitle
);
router.put(
  "/chapters/:chapterId/assignments/title/:assignmentId",
  updateAssignmentTitle
);
router.post("/chapters/assignments", addAssignmentTitle);
router.post("/chapters/:chapterId/submission", insertAssignmentSubmission);
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
router.put("/assignments/review/:submissionId", updateReviewAssignment);
router.put("/assignments/score/:submissionId", updatePointAssignment);

// Lấy thông tin của bài submitted
router.get(
  "/assignments/:assignmentId/submitted",
  authorize,
  getAssignmentSubmitted
);
// sửa Status của bài tập submitted
router.put(
  "/assignments/:assignmentId/submitted/status",
  authorize,
  updateSubmissionStatus
);
// Lấy tất cả Bài tập của 1 môn học
router.get("/:courseId/assignments", getAllAssignmentsOfCourse);
// Lấy danh sách lớp và cả tình trạng bài nộp assgnmentsubmitted
router.get(
  "/assignments/:assignmentId/classroom/:classId",
  getAllStudentAndAssignmentStatus
);

export default router;
