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
  const chapterId = req.params.chapterId;

  const q = `
    SELECT lessons.*
    FROM lessons
    JOIN chapters ON lessons.ChapterId = chapters.ChapterId
    WHERE lessons.ChapterId = ?
    ORDER BY lessons.LessonPosition ASC
  `;

  db.query(q, [chapterId], (err, data) => {
    if (err) {
      console.error("Error fetching lessons:", err);
      return res.status(500).json(err);
    }
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
  const { lessonTitle, chapterId } = req.body;

  // Validate input
  if (!lessonTitle || !chapterId) {
    return res.status(400).json({
      success: false,
      message: "Lesson title and chapter ID are required",
    });
  }

  // Query to get the maximum LessonPosition for the given ChapterId
  const getMaxPositionQuery = `
    SELECT MAX(CAST(LessonPosition AS UNSIGNED)) AS maxPosition
    FROM lessons
    WHERE ChapterId = ?
  `;

  // Execute query to get max LessonPosition
  db.query(getMaxPositionQuery, [chapterId], (error, results) => {
    if (error) {
      console.error("Error fetching max LessonPosition:", error);
      return res.status(500).json({
        error: "Error fetching max LessonPosition",
        details: error,
      });
    }

    // Determine the next LessonPosition (maxPosition + 1)
    const maxPosition =
      results[0].maxPosition !== null ? results[0].maxPosition : 0;
    const lessonPosition = maxPosition + 1;

    // Generate a new LessonId using uuidv4()
    const lessonId = uuidv4();

    // Insert query to add new lesson with calculated LessonPosition
    const insertLessonQuery = `
      INSERT INTO lessons (LessonId, LessonTitle, ChapterId, LessonPosition)
      VALUES (?, ?, ?, ?)
    `;

    // Execute query to insert new lesson
    db.query(
      insertLessonQuery,
      [lessonId, lessonTitle, chapterId, lessonPosition],
      (error, results) => {
        if (error) {
          console.error("Error inserting new lesson:", error);
          return res.status(500).json({
            error: "Error inserting new lesson",
            details: error,
          });
        }

        // Return success message and inserted LessonId
        return res.status(201).json({
          success: true,
          message: "Lesson added successfully",
          lessonId: lessonId,
        });
      }
    );
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
// Thay đổi thứ tự bài học trong một chương
export const updateLessonOrder = async (req, res) => {
  const lessonOrder = req.body.lessonOrder; // Expecting an array of LessonId

  if (!Array.isArray(lessonOrder) || lessonOrder.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid lesson order format",
    });
  }

  try {
    for (let i = 0; i < lessonOrder.length; i++) {
      const lessonId = lessonOrder[i];
      const lessonPosition = i + 1; // Positions are 1-based

      const query = `UPDATE lessons SET LessonPosition = ? WHERE LessonId = ?`;

      // Use async/await to wait for the query execution
      await new Promise((resolve, reject) => {
        db.query(query, [lessonPosition, lessonId], (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson positions updated successfully",
    });
  } catch (err) {
    console.error("Error updating lesson positions:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating lesson positions",
      error: err,
    });
  }
};
