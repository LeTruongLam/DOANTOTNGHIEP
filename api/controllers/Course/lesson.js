import { db } from "../../db.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const authorize = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const decodedToken = jwt.verify(token, "jwtkey");
    req.userRole = decodedToken.role;
    next();
  } catch (err) {
    return res.status(403).json("Token is not valid!");
  }
};
export const getLesson = (req, res) => {
  const chapterId = req.params.chapterId; // Sử dụng req.params.chapterId thay vì req.param.chapterId
  const lessonId = req.params.lessonId;
  const q = `
      SELECT lessons.*
      FROM lessons
      JOIN chapters ON lessons.ChapterId = chapters.ChapterId
      WHERE lessons.ChapterId = ? AND lessons.LessonId = ?`;

  db.query(q, [chapterId, lessonId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getLessons = (req, res) => {
  const chapterId = req.params.chapterId; // Sử dụng req.params.chapterId thay vì req.param.chapterId

  const q = `
      SELECT lessons.*
      FROM lessons
      JOIN chapters ON lessons.ChapterId = chapters.ChapterId
      WHERE lessons.ChapterId = ?`;

  db.query(q, [chapterId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const deleteLesson = (req, res) => {
  const chapterId = req.params.chapterId;
  const lessonId = req.params.lessonId;
  const q = `
      DELETE FROM lessons
      WHERE ChapterId = ? AND LessonId = ?
    `;

  db.query(q, [chapterId, lessonId], (err, result) => {
    if (err) return res.status(500).json(err);
    console.log("Lesson deleted successfully");
    return res.status(200).json({ message: "Lesson deleted successfully" });
  });
};

export const addLessonTitle = (req, res) => {
  const lessonTitle = req.body.lessonTitle;
  const chapterId = req.body.chapterId;
  const lessonId = uuidv4();

  const q = `
      INSERT INTO lessons (LessonId, LessonTitle, ChapterId)
      VALUES (? ,?, ?)
    `;

  db.query(q, [lessonId, lessonTitle, chapterId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ message: "Lesson added successfully" });
  });
};

export const getLessonTitle = (req, res) => {
  const lessonId = req.params.lessonId;
  const chapterId = req.params.chapterId;
  const q =
    "SELECT LessonTitle FROM lessons WHERE LessonId = ? AND ChapterId = ?";
  db.query(q, [lessonId, chapterId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const lesson = result[0];
    return res.status(200).json({ lessonTitle: lesson.LessonTitle });
  });
};
export const updateLessonTitle = (req, res) => {
  const chapterId = req.params.chapterId;
  const lessonId = req.params.lessonId;
  const lessonTitle = req.body.lessonTitle;
  const q =
    "UPDATE lessons SET LessonTitle = ? WHERE ChapterId = ? AND LessonId = ?";
  const values = [lessonTitle, chapterId, lessonId];

  // Check user role and chapter update permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }
    return res.json({ message: "Lesson title has been updated." });
  });
};

export const getLessonVideo = (req, res) => {
  const lessonId = req.params.lessonId;
  const chapterId = req.params.chapterId;
  const q =
    "SELECT LessonVideo FROM lessons WHERE LessonId = ? AND ChapterId = ?";
  db.query(q, [lessonId, chapterId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const lesson = result[0];
    return res.status(200).json({ lessonVideo: lesson.LessonVideo });
  });
};

export const updateLessonVideo = (
  lessonVideo,
  chapterId,
  lessonId,
  req,
  res
) => {
  const q =
    "UPDATE lessons SET LessonVideo = ? WHERE ChapterId = ? AND LessonId = ?";
  const values = [lessonVideo, chapterId, lessonId];

  // Check user role and chapter update permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Lesson not found." });
    }
    return res.json({ message: "Lesson video has been updated." });
  });
};
export const getLessonDesc = (req, res) => {
  const lessonId = req.params.lessonId;
  const chapterId = req.params.chapterId;

  const q =
    "SELECT LessonDesc FROM lessons WHERE  LessonId = ? AND ChapterId = ? ";
  const values = [lessonId, chapterId];

  // Check user role and course access permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.length === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }
    const lesson = data[0];
    const lessonDesc = lesson.LessonDesc;

    return res.json({ lessonDesc });
  });
};
export const updateLessonDesc = (req, res) => {
  const lessonId = req.params.lessonId;
  const chapterId = req.params.chapterId;
  const lessonDesc = req.body.lessonDesc;

  const q =
    "UPDATE lessons SET LessonDesc = ? WHERE LessonId = ? AND ChapterId = ?";
  const values = [lessonDesc, lessonId, chapterId];

  // Check user role and chapter update permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Lesson not found." });
    }

    return res.json("Lesson description has been updated.");
  });
};
