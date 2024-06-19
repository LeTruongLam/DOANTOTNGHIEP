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
    ORDER BY chapters.ChapterPosition ASC
  `;
  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      console.error("Error fetching chapters:", err);
      return res.status(500).json(err);
    }
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
    return res.status(200).json({ message: "Chapter deleted successfully" });
  });
};

export const insertChapterTitle = (req, res) => {
  const { chapterTitle, courseId } = req.body;

  // Truy vấn để lấy ChapterPosition cao nhất hiện tại cho courseId, sắp xếp theo thứ tự tăng dần
  const getMaxPositionQuery = `
    SELECT MAX(CAST(ChapterPosition AS UNSIGNED)) AS maxPosition
    FROM chapters
    WHERE CourseId = ?
  `;

  // Thực hiện truy vấn để lấy maxPosition
  db.query(getMaxPositionQuery, [courseId], (error, results) => {
    if (error) {
      console.error("Error fetching max ChapterPosition:", error);
      return res
        .status(500)
        .json({ error: "Error fetching max ChapterPosition", details: error });
    }

    // Lấy giá trị maxPosition từ kết quả truy vấn
    const maxPosition =
      results[0].maxPosition !== null ? results[0].maxPosition : 0;
    // Tạo truy vấn để chèn chương mới với ChapterPosition là maxPosition + 1
    const insertChapterQuery = `
      INSERT INTO chapters (ChapterTitle, CourseId, ChapterPosition)
      VALUES (?, ?, ?)
    `;

    // Thực thi truy vấn chèn chương mới với ChapterPosition tính toán được
    db.query(
      insertChapterQuery,
      [chapterTitle, courseId, maxPosition + 1],
      (error, results) => {
        if (error) {
          console.error("Error inserting new chapter:", error);
          return res
            .status(500)
            .json({ error: "Error inserting new chapter", details: error });
        }

        // Trả về thông báo và mã trạng thái thành công nếu không có lỗi
        return res.status(200).json({
          message: "Chapter title has been added.",
          chapterId: results.insertId,
        });
      }
    );
  });
};

export const getChapterTitle = (req, res) => {
  const chapterId = req.params.chapterId;
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
  const chapterId = req.params.chapterId;
  const chapterTitle = req.body.chapterTitle;

  const q = "UPDATE chapters SET ChapterTitle = ? WHERE ChapterId = ?";
  const values = [chapterTitle, chapterId];

  // Check user role and chapter update permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }

    return res.json("Chapter title has been updated.");
  });
};

export const getChapterDesc = (req, res) => {
  const chapterId = req.params.chapterId;

  const q = "SELECT ChapterDesc FROM chapters WHERE ChapterId = ? ";
  const values = [chapterId];
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
};
export const updateChapterDesc = (req, res) => {
  const chapterId = req.params.chapterId;
  const chapterDesc = req.body.chapterDesc;

  const q = "UPDATE chapters SET ChapterDesc = ? WHERE ChapterId = ?";
  const values = [chapterDesc, chapterId];

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }

    return res.json("Chapter description has been updated.");
  });
};

export const getChapterDocument = (req, res) => {
  const chapterId = req.params.chapterId;
  const q = "SELECT * FROM documents WHERE ChapterId = ? ";
  const values = [chapterId];

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.length === 0) {
      return res.json({ message: "Chapter Document not found." });
    }
    const chapter = data[0];

    return res.json(data);
  });
};
export const deleteChapterDocument = (req, res) => {
  const chapterId = req.params.chapterId;
  const documentId = req.params.documentId;

  const q = "DELETE FROM documents WHERE ChapterId = ? AND DocumentId = ?";
  const values = [chapterId, documentId];

  // Check user role and course access permission

  db.query(q, values, (err, result) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Chapter or document not found." });
    }

    return res.json({ message: "Document deleted successfully." });
  });
};

// Thay đổi thứ tự chương
export const updateChapterOrder = async (req, res) => {
  const chapterOrder = req.body.chapterOrder; // Expecting an array of ChapterId

  if (!Array.isArray(chapterOrder) || chapterOrder.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid chapter order format",
    });
  }

  try {
    for (let i = 0; i < chapterOrder.length; i++) {
      const chapterId = chapterOrder[i];
      const chapterPosition = i + 1; // Positions are 1-based

      const query = `UPDATE chapters SET ChapterPosition = ? WHERE ChapterId = ?`;

      // Use async/await to wait for the query execution
      await new Promise((resolve, reject) => {
        db.query(query, [chapterPosition, chapterId], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    }

    res.status(200).json({
      success: true,
      message: "Chapter positions updated successfully",
    });
  } catch (err) {
    console.error("Error updating chapter positions:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating chapter positions",
      error: err,
    });
  }
};
