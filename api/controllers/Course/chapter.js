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

export const getChapterById = (req, res) => {
  const courseId = req.params.courseId;
  const chapterId = req.params.chapterId;
  const q = `
    SELECT *
    FROM chapters
    WHERE CourseId = ? AND ChapterId = ?
  `;

  db.query(q, [courseId, chapterId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An unexpected error occurred." });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }
    const chapter = data[0];

    return res.status(200).json(chapter);
  });
};

export const getAllChapter = (req, res) => {
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

export const insertChapterTitle = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const chapterTitle = req.body.chapterTitle;
    const courseId = req.body.courseId;
    const q = "INSERT INTO chapters (ChapterTitle, CourseId) VALUES (?, ?)";

    // Check user role and course update permission
    if (userInfo.role !== "admin") {
      return res.status(403).json("Unauthorized!");
    }

    db.query(q, [chapterTitle, courseId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Course title has been updated.");
    });
  });
};
export const getChapterTitle = (req, res) => {
  const chapterId = req.params.chapterId;
  console.log(chapterId);
  const q = `
    SELECT ChapterTitle
    FROM chapters
    WHERE ChapterId = ?
  `;

  db.query(q, [chapterId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An unexpected error occurred." });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }
    const chapter = data[0];
    const chapterTitle = chapter.ChapterTitle;
    return res.status(200).json({ chapterTitle });
  });
};
export const updateChapterTitle = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const chapterId = req.params.chapterId;
    const chapterTitle = req.body.chapterTitle;

    const q = "UPDATE chapters SET ChapterTitle = ? WHERE ChapterId = ?";
    const values = [chapterTitle, chapterId];

    // Check user role and chapter update permission
    if (userInfo.role !== "admin") {
      return res.status(403).json("Unauthorized!");
    }

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "Chapter not found." });
      }

      return res.json("Chapter title has been updated.");
    });
  });
};

export const getChapterDesc = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const chapterId = req.params.chapterId;

    const q = "SELECT ChapterDesc FROM chapters WHERE ChapterId = ? ";
    const values = [chapterId];

    // Check user role and course access permission
    if (userInfo.role !== "admin") {
      return res.status(403).json("Unauthorized!");
    }

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.length === 0) {
        return res.status(404).json({ error: "Chapter not found." });
      }
      const chapter = data[0];
      const chapterDesc = chapter.ChapterDesc;

      return res.json({ chapterDesc });
    });
  });
};
export const updateChapterDesc = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const chapterId = req.params.chapterId;
    const chapterDesc = req.body.chapterDesc;

    const q = "UPDATE chapters SET ChapterDesc = ? WHERE ChapterId = ?";
    const values = [chapterDesc, chapterId];

    // Check user role and chapter update permission
    if (userInfo.role !== "admin") {
      return res.status(403).json("Unauthorized!");
    }

    db.query(q, values, (err, data) => {
      if (err)
        return res.status(500).json({ error: "An unexpected error occurred." });

      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "Chapter not found." });
      }

      return res.json("Chapter description has been updated.");
    });
  });
};
