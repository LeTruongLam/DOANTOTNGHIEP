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

  let q = `INSERT INTO Exams(ExamId,  CourseId, ExamTitle, ExamDescription, TimeStart, TimeLimit, ConfirmAccess, AccessCode, IsDeleted)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
        questions.forEach((questionId) => {
          const examQuestionId = uuidv4();
          const questionQuery = `INSERT INTO ExamQuestions (ExamQuestionId, ExamId, QuestionId) VALUES (?, ?, ?)`;
          db.query(
            questionQuery,
            [examQuestionId, examId, questionId],
            (err) => {
              if (err) {
                console.error(err);
              }
            }
          );
        });

        // Insert classes into examclasses table
        classes.forEach((classId) => {
          const examClassId = uuidv4();
          const classQuery = `INSERT INTO ExamClasses (ExamClassId, ExamId, ClassId) VALUES (?, ?, ?)`;
          db.query(classQuery, [examClassId, examId, classId], (err) => {
            if (err) {
              console.error(err);
            }
          });
        });

        res.status(200).json({ message: "Exam added successfully." });
      }
    }
  );
};

export const getExam = (req, res) => {
  const courseId = req.params.courseId;
  let q = `
    SELECT E.*, COUNT(EQ.ExamQuestionId) AS QuestionCount
    FROM Exams E
    LEFT JOIN ExamQuestions EQ ON E.ExamId = EQ.ExamId
    WHERE E.CourseId = ?
    GROUP BY E.ExamId
  `;

  db.query(q, [courseId], (err, data) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(data);
    }
  });
};


export const getExamById = (req, res) => {
  const examId = req.params.examId;
  const query = `
    SELECT Q.*
    FROM Exams E
    JOIN ExamQuestions EQ ON E.ExamId = EQ.ExamId
    JOIN Questions Q ON Q.QuestionId = EQ.QuestionId
    WHERE E.ExamId = ?
  `;

  db.query(query, [examId], (error, data) => {
    console.log(data);

    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(200).json(data);
    }
  });
};