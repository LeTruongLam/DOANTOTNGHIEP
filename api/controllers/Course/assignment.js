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
// Lấy thông tin 1 bài assignment
export const getAssignment = (req, res) => {
  const chapterId = req.params.chapterId; // Sử dụng req.params.chapterId thay vì req.param.chapterId
  const assignmentId = req.params.assignmentId;
  const q = `
      SELECT assignments.*
      FROM assignments
      JOIN chapters ON assignments.ChapterId = chapters.ChapterId
      WHERE assignments.ChapterId = ? AND assignments.AssignmentId = ?`;

  db.query(q, [chapterId, assignmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    const data = result[0];

    return res.status(200).json(data);
  });
};
// Lấy thông tin 1 bài assignment theo assignmentId
export const getAssignmentById = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const q = `
      SELECT assignments.*, courses.title as CourseTitle
      FROM assignments
      JOIN chapters ON assignments.ChapterId = chapters.ChapterId
      JOIN courses ON courses.CourseId = chapters.CourseId
      WHERE assignments.AssignmentId = ?`;
  db.query(q, [assignmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    const data = result[0];
    return res.status(200).json(data);
  });
};
// Lấy thông tin nhiều bài assignment theo chương

export const getAssignments = (req, res) => {
  const chapterId = req.params.chapterId; // Sử dụng req.params.chapterId thay vì req.param.chapterId
  const q = `
      SELECT assignments.*
      FROM assignments
      JOIN chapters ON assignments.ChapterId = chapters.ChapterId
      WHERE assignments.ChapterId = ?`;

  db.query(q, [chapterId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(200).json([]);
    return res.status(200).json(data);
  });
};

// Xóa 1 bài assignment

export const deleteAssignment = (req, res) => {
  const chapterId = req.params.chapterId;
  const assignmentId = req.params.assignmentId;
  const q = `
      DELETE FROM assignments
      WHERE ChapterId = ? AND AssignmentId = ?
    `;

  db.query(q, [chapterId, assignmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ message: "Assignment deleted successfully" });
  });
};
// Xóa file assignment đã đính kèm

export const deleteAssignmentFileAttached = (req, res) => {
  const assignmentFileId = req.params.assignmentFileId;
  const assignmentId = req.params.assignmentId;
  const q = `
      DELETE FROM assignmentfile
      WHERE AssignmentFileId = ? AND AssignmentId = ?
    `;

  db.query(q, [assignmentFileId, assignmentId], (err, result) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json({ message: "Assignment file attached deleted successfully" });
  });
};
// Thêm title assignment

export const addAssignmentTitle = (req, res) => {
  const assignmentId = uuidv4();

  const assignmentTitle = req.body.assignmentTitle;
  const chapterId = req.body.chapterId;
  const courseId = req.body.courseId;

  const q = `
      INSERT INTO assignments (AssignmentId, AssignmentTitle, ChapterId, CourseId)
      VALUES (?, ?, ?, ?)
    `;

  db.query(
    q,
    [assignmentId, assignmentTitle, chapterId, courseId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({ message: "Assignment added successfully" });
    }
  );
};

export const getAssignmentTitle = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const chapterId = req.params.chapterId;
  const q =
    "SELECT AssignmentTitle FROM assignments WHERE AssignmentId = ? AND ChapterId = ?";
  db.query(q, [assignmentId, chapterId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const assignment = result[0];
    return res
      .status(200)
      .json({ assignmentTitle: assignment.AssignmentTitle });
  });
};

export const updateAssignmentTitle = (req, res) => {
  const chapterId = req.params.chapterId;
  const assignmentId = req.params.assignmentId;
  const assignmentTitle = req.body.assignmentTitle;
  const q =
    "UPDATE assignments SET AssignmentTitle = ? WHERE ChapterId = ? AND AssignmentId = ?";
  const values = [assignmentTitle, chapterId, assignmentId];

  // Check user role and chapter update permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "assignment not found." });
    }
    return res.json({ message: "assignment title has been updated." });
  });
};

export const getAssignmentDesc = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const chapterId = req.params.chapterId;

  const q =
    "SELECT AssignmentDesc FROM assignments WHERE  AssignmentId = ? AND ChapterId = ? ";
  const values = [assignmentId, chapterId];

  // Check user role and course access permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.length === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }
    const assignment = data[0];
    const assignmentDesc = assignment.AssignmentDesc;

    return res.json({ assignmentDesc });
  });
};
export const updateAssignmentDesc = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const chapterId = req.params.chapterId;
  const assignmentDesc = req.body.assignmentDesc;

  const q =
    "UPDATE  assignments SET  AssignmentDesc = ? WHERE  AssignmentId = ? AND ChapterId = ?";
  const values = [assignmentDesc, assignmentId, chapterId];

  // Check user role and chapter update permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "assignments not found." });
    }

    return res.json("assignments description has been updated.");
  });
};

export const getAssignmentDate = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const chapterId = req.params.chapterId;

  const q =
    "SELECT StartDate, EndDate FROM assignments WHERE AssignmentId = ? AND ChapterId = ?";
  const values = [assignmentId, chapterId];

  // Check user role and course access permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.length === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }

    const assignment = data[0];
    const startDate = assignment.StartDate;
    const endDate = assignment.EndDate;

    return res.json({ startDate, endDate });
  });
};

export const updateAssignmentDate = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const chapterId = req.params.chapterId;
  const endDate = req.body.endDate;

  const q =
    "UPDATE  assignments SET  `EndDate` = ?  WHERE  AssignmentId = ? AND ChapterId = ?";
  const values = [endDate, assignmentId, chapterId];
  // Check user role and chapter update permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "assignments not found." });
    }
    return res.json("assignments date has been updated.");
  });
};

export const getAssignmentFile = (req, res) => {
  const assignmentId = req.params.assignmentId;

  const q = "SELECT * FROM assignmentfile WHERE AssignmentId = ? ";
  const values = [assignmentId];

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.length === 0) {
      return res.json({ message: "assignmentId not found." });
    }
    const chapter = data[0];
    return res.json(data);
  });
};
export const updateAssignmentFile = (
  assignmentFile,
  chapterId,
  assignmentId,
  req,
  res
) => {
  const q =
    "UPDATE assignments SET AssignmentFile = ? WHERE ChapterId = ? AND AssignmentId = ?";
  const values = [assignmentFile, chapterId, assignmentId];

  // Check user role and chapter update permission

  db.query(q, values, (err, data) => {
    if (err)
      return res.status(500).json({ error: "An unexpected error occurred." });

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "assignmentFile not found." });
    }
    return res.json({ message: "assignmentFile has been updated." });
  });
};
// trả Api để giáo viên có thể xem các assignment mà sinh viên đã nộp
export const getAssignmentSubmission = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const q = `SELECT
        submissions.SubmissionId,
        submissions.SubmissionDate,
        submissions.Score,
        courses.CourseId,
        courses.title,
        teachers.TeacherId,
        teachers.TeacherName,
        students.UserId,
        students.StudentName,
        students.StudentCode,
        assignments.AssignmentId,
        assignments.AssignmentTitle,
        chapters.ChapterId,
        chapters.ChapterTitle
      FROM 
        submissions
        JOIN courses ON courses.CourseId = submissions.CourseId 
        JOIN teachers ON teachers.TeacherId = courses.TeacherId 
        JOIN students ON students.UserId = submissions.UserId 
        JOIN assignments ON assignments.AssignmentId = submissions.AssignmentId 
        JOIN chapters ON submissions.ChapterId = chapters.ChapterId 
      WHERE 
        submissions.AssignmentId = ? AND submissions.Status = 1 `;

  db.query(q, [assignmentId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (data.length === 0) {
      return res.json({ message: "assignment submited none." });
    }
    return res.json(data);
  });
};
// Giáo viên nhận xét đánh giá
export const updateReviewAssignment = (req, res) => {
  const submissionId = req.params.submissionId;
  const assignmentReview = req.body.assignmentReview;
  const gradedStatus = true;

  const q =
    "UPDATE submissions SET `Review` = ?, `Graded` = ? WHERE SubmissionId = ?";
  db.query(q, [assignmentReview, gradedStatus, submissionId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json("Submission review has been updated.");
  });
};
// Giáo viên nhận xét đánh giá
export const updatePointAssignment = (req, res) => {
  const submissionId = req.params.submissionId;
  const assignmentPoint = req.body.assignmentPoint;
  const gradedStatus = true;

  const q =
    "UPDATE submissions SET `Score` = ?, `Graded` = ? WHERE SubmissionId = ?";
  const values = [assignmentPoint, gradedStatus, submissionId];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });

    return res.json("Submission score has been updated.");
  });
};

// lấy thông tin bài đã nộp
export const getAssignmentSubmitted = (req, res) => {
  const submissionId = req.params.submissionId;
  const q = `SELECT sb.*, s.StudentName, s.StudentCode FROM submissions sb
          JOIN students s ON s.UserId = sb.UserId
          WHERE sb.SubmissionId = ? `;

  db.query(q, [submissionId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error!" });
    }

    if (data.length === 0) {
      return res.json({ message: "No assignment submission found." });
    }
    return res.json(data);
  });
};

// lấy thông tin bài đã nộp view student
export const getAssignmentSubmittedStudentView = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const userId = req.params.userId;
  const q = `SELECT * FROM submissions 
          WHERE AssignmentId = ? AND UserId = ?`;
  db.query(q, [assignmentId, userId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error!" });
    }
    return res.json(data);
  });
};
export const updateSubmissionStatus = (req, res) => {
  const assignmentId = req.params.assignmentId;
  const submissionStatus = req.body.submissionStatus ? 1 : 0;
  const userId = req.userInfo.id;
  const q = `UPDATE submissions SET Status = ?, SubmissionDate = NOW() WHERE AssignmentId = ? AND UserId = ?;`;
  db.query(q, [submissionStatus, assignmentId, userId], (err, data) => {
    if (err) {
      console.error(
        "Lỗi khi cập nhật trạng thái nộp bài trong cơ sở dữ liệu: ",
        err
      );
      return res.status(500).json({ error: "Lỗi cơ sở dữ liệu!" });
    }
    return res.json(data);
  });
};
// Nộp bài assignment mà không có file
export const insertAssignmentSubmission = (req, res) => {
  const { assignmentId, chapterId, userId, courseId } = req.body;

  // First, check if there is already a submission for this assignment and user
  const queryCheck = `
    SELECT * FROM submissions 
    WHERE AssignmentId = ? AND UserId = ?
  `;
  const valuesCheck = [assignmentId, userId];

  db.query(queryCheck, valuesCheck, (err, rows) => {
    if (err) {
      console.error("Error checking submission data in the database:", err);
      return res.status(500).json({
        success: false,
        message: "An error occurred while checking submission data",
      });
    }

    if (rows.length > 0) {
      // If there is already a submission, update it instead of inserting new
      const submissionId = rows[0].SubmissionId;
      const queryUpdate = `
        UPDATE submissions 
        SET ChapterId = ?, CourseId = ?, SubmissionDate = NOW()
        WHERE SubmissionId = ?
      `;
      const valuesUpdate = [chapterId, courseId, submissionId];

      db.query(queryUpdate, valuesUpdate, (errUpdate, resultUpdate) => {
        if (errUpdate) {
          console.error(
            "Error updating submission data in the database:",
            errUpdate
          );
          return res.status(500).json({
            success: false,
            message: "An error occurred while updating submission data",
          });
        }

        console.log("Submission data has been updated in the database");
        return res.status(200).json({
          success: true,
          message: "Submission data has been updated!",
          data: resultUpdate,
        });
      });
    } else {
      // If there is no existing submission, insert a new one
      const submissionId = uuidv4();
      const queryInsert = `
        INSERT INTO submissions (SubmissionId, AssignmentId, UserId, ChapterId, CourseId, SubmissionDate)
        VALUES (?, ?, ?, ?, ?, NOW());
      `;
      const valuesInsert = [
        submissionId,
        assignmentId,
        userId,
        chapterId,
        courseId,
      ];

      db.query(queryInsert, valuesInsert, (errInsert, resultInsert) => {
        if (errInsert) {
          console.error(
            "Error inserting submission data into the database:",
            errInsert
          );
          return res.status(500).json({
            success: false,
            message: "An error occurred while inserting submission data",
          });
        }

        console.log("Submission data has been inserted into the database");
        return res.status(201).json({
          success: true,
          message: "Submission data has been inserted!",
          data: resultInsert,
        });
      });
    }
  });
};

export const deleteAssignmentFile = (req, res) => {
  const userInfo = req.userInfo;
  const assignmentId = req.params.assignmentId;
  const userId = userInfo.id;
  const q = `SELECT * FROM submissions 
               WHERE AssignmentId = ? AND UserId = ?`;

  db.query(q, [assignmentId, userId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error!" });
    }

    if (data.length === 0) {
      return res.json({ message: "No assignment submission found." });
    }

    return res.json(data);
  });
};

// Lấy tất cả assignment của 1 môn học
export const getAllAssignmentsOfCourse = (req, res) => {
  const courseId = req.params.courseId;
  const q = `
      SELECT a.*, c.CourseId, c.title, chapters.* , c.TeacherId, c.CourseCode
      FROM assignments a
      JOIN courses c ON a.CourseId = c.CourseId
      JOIN chapters ON chapters.ChapterId = a.ChapterId
      WHERE a.CourseId = ?`;

  db.query(q, [courseId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(200).json([]);
    return res.status(200).json(data);
  });
};
// Lấy tất cả sinh viên của 1 lớp có nộp bài hoặc chưa

export const getAllStudentAndAssignmentStatus = (req, res) => {
  const classId = req.params.classId;
  const assignmentId = req.params.assignmentId;
  const q = `
    SELECT s.StudentId, s.StudentName, s.StudentCode, sb.SubmissionId, sb.SubmissionDate, sb.Score,sb.Graded, sb.Status,sb.Review, sb.SubmissionId, sb.SubmissionFiles, s.UserId
    FROM students s
    JOIN class_student sc ON s.UserId = sc.UserId
    JOIN classes c ON sc.ClassId = c.ClassId
    JOIN courses cs ON c.CourseId = cs.CourseId
    LEFT JOIN submissions sb ON s.UserId = sb.UserId AND cs.CourseId = sb.CourseId AND sb.AssignmentId = ?
    WHERE c.ClassId = ?
    ORDER BY s.StudentCode `;
  db.query(q, [assignmentId, classId], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (data.length === 0) return res.status(200).json([]);
    return res.status(200).json(data);
  });
};
// Giao vien tao bai submission neu sinh vien khong nop bai

export const insertAssignmentSubmissionTeacher = (req, res) => {
  const submissionId = uuidv4();
  const assignmentId = req.body.assignmentId;
  const chapterId = req.body.chapterId;
  const userId = req.body.userId;
  const courseId = req.body.courseId;
  let status = 0;
  const query = `INSERT INTO submissions (SubmissionId,AssignmentId, UserId, ChapterId, CourseId, Status) VALUES (?,?, ?, ?, ?,?);`;

  db.query(
    query,
    [submissionId, assignmentId, userId, chapterId, courseId, status],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: "Lỗi",
        });
      } else {
        const id = submissionId;
        res.status(201).json({
          data: id,
        });
      }
    }
  );
};
