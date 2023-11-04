import { db } from "../../db.js";
import jwt from "jsonwebtoken";

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

export const getChapter = (req, res) => {
  const q = `
      SELECT *
      FROM chapters
      INNER JOIN courses ON chapters.courseId = courses.courseId
      WHERE courses.courseId = ?
    `;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addChapter = (req, res) => {
  const { chapterTitle, chapterDesc, chapterVideo, chapterPosition, courseId } =
    req.body;

  const q = `
      INSERT INTO chapters (ChapterTitle, ChapterDesc, ChapterVideo, ChapterPosition, CourseId)
      VALUES (?, ?, ?, ?, ?)
    `;

  db.query(
    q,
    [chapterTitle, chapterDesc, chapterVideo, chapterPosition, courseId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({ message: "Chapter added successfully" });
    }
  );
};
export const editChapter = (req, res) => {
  const { chapterTitle, chapterId } = req.body;
  const courseId = req.params.id;
  const query = `
    UPDATE chapters
    SET ChapterTitle = ?, CourseId = ?
    WHERE ChapterId = ?
  `;

  db.query(query, [chapterTitle, courseId, chapterId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ message: "Cập nhật chương thành công" });
  });
};
export const deleteChapter = (req, res) => {
  const chapterId = req.params.chapterId;
  const q = `
      DELETE FROM chapters
      WHERE ChapterId = ?
    `;

  db.query(q, [chapterId], (err, result) => {
    if (err) return res.status(500).json(err);
    console.log("Chapter deleted successfully");
    return res.status(200).json({ message: "Chapter deleted successfully" });
  });
};
