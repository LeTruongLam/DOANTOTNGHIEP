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
    const { chapterTitle, chapterDesc, chapterVideo, chapterPosition,courseId } = req.body;
  
    const q = `
      INSERT INTO chapters (ChapterTitle, ChapterDesc, ChapterVideo, ChapterPosition, CourseId)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    db.query(q, [chapterTitle, chapterDesc, chapterVideo, chapterPosition, courseId], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({ message: "Chapter added successfully" });
    });
  };




//   export const editChapter = (req, res) => {
//     const { title, content } = req.body;
//     const chapterId = req.params.id;
  
//     const q = "UPDATE chapters SET title = ?, content = ? WHERE chapterId = ?";
  
//     db.query(q, [title, content, chapterId], (err, result) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json({ message: "Chapter updated successfully" });
//     });
//   };
  
//   export const deleteChapter = (req, res) => {
//     const chapterId = req.params.id;
  
//     const q = "DELETE FROM chapters WHERE chapterId = ?";
  
//     db.query(q, [chapterId], (err, result) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json({ message: "Chapter deleted successfully" });
//     });
//   };