import { db } from "../../db.js";
import { v4 as uuidv4 } from "uuid";

export const addExam = (req, res) => {
  const examId = uuidv4();
  const courseId = req.params.courseId;
  const {
    examTitle,
    examDescription = "",
    startTime,
    timeLimit,
    questions,
    confirmAccess,
    accessCode = "",
    classes = [],
  } = req.body;
  let q = `INSERT INTO Exams(ExamId,  CourseId, ExamTitle, ExamDescription,TimeStart , TimeLimit,   ConfirmAccess, AccessCode, IsDeleted )
        VALUES (?, ?, ?, ?,?,?,?,?,?)`;
  db.query(
    q,
    [
      examId,
      courseId,
      examTitle,
      examDescription,
      startTime,
      timeLimit,
      confirmAccess,
      accessCode,
      0,
    ],
    (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({ message: "Exam added successfully." });
      }
    }
  );
};
export const getExam = (req, res) => {
  const courseId = req.params.courseId;
  let q = `SELECT * FROM Exams WHERE CourseId = ?`;

  db.query(q, [courseId], (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
};
