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
  const examQuery = `
    SELECT *
    FROM Exams
    WHERE ExamId = ?
  `;

  const questionsQuery = `
    SELECT Q.*
    FROM ExamQuestions EQ
    JOIN Questions Q ON Q.QuestionId = EQ.QuestionId
    WHERE EQ.ExamId = ?
  `;

  db.query(examQuery, [examId], (error, examData) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error });
    } else {
      const exam = examData[0];

      db.query(questionsQuery, [examId], (error, questionsData) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error });
        } else {
          const questions = questionsData;

          exam.questions = questions;
          res.status(200).json(exam);
        }
      });
    }
  });
};
export const ResultExams = (req, res) => {
  const resultExamId = uuidv4();
  const userInfo = req.userInfo;

  const examId = req.params.examId;
  const answers = req.body.answers;
  const questionsQuery = `
    SELECT Q.QuestionType, Q.QuestionAnswer, Q.QuestionId, Q.QuestionOptions
    FROM ExamQuestions EQ
    JOIN Questions Q ON Q.QuestionId = EQ.QuestionId
    WHERE EQ.ExamId = ?
  `;

  // Truy vấn thông tin bài thi
  db.query(questionsQuery, [examId], (error, examResults) => {
    if (error) {
      console.error("Lỗi truy vấn cơ sở dữ liệu:", error);
      res.sendStatus(500);
    } else {
      // Kiểm tra xem bài thi có tồn tại hay không
      if (examResults.length === 0) {
        res.status(404).json({ message: "Không tìm thấy bài thi." });
      } else {
        // console.log(examResults);
        // Lấy câu trả lời chính xác từ bài thi
        const correctAnswers = examResults.map((question) => {
          const options = question.QuestionOptions;
          // console.log(correctOption);
          const correctOptions = options.filter((option) => option.isAnswer);
          const correctAnswerIds = correctOptions.map((option) => option.id);
          return {
            questionId: question.QuestionId,
            correctAnswer:
              correctAnswerIds.length > 0 ? correctAnswerIds : null,
          };
        });

        console.log(correctAnswers);

        let score = 0;

        // So sánh câu trả lời của người dùng với câu trả lời chính xác
        for (const answer of answers) {
          const questionId = answer.questionId;
          const answerIds = answer.answerId;
          const correctAnswer = correctAnswers.find(
            (ca) => ca.questionId === questionId
          );

          if (
            correctAnswer &&
            correctAnswer.correctAnswer &&
            answerIds.length === correctAnswer.correctAnswer.length &&
            answerIds.every((answerId) =>
              correctAnswer.correctAnswer.includes(answerId)
            )
          ) {
            score++;
          }
        }
        console.log(score);
        // Lưu trữ kết quả thi và điểm số vào cơ sở dữ liệu
        const insertQuery = `
        INSERT INTO ResultExams (ResultExamId, ExamId, SubmissionAnswers, Score, UserId, SubmissionTime)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

        db.query(
          insertQuery,
          [resultExamId, examId, JSON.stringify(answers), score, userInfo.id],
          (error, result) => {
            if (error) {
              console.error("Lỗi lưu trữ kết quả thi:", error);
              res.sendStatus(500);
            } else {
              res.status(200).json({ score });
            }
          }
        );
      }
    }
  });
};
