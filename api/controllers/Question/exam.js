import { db } from "../../db.js";
import { v4 as uuidv4 } from "uuid";

export const addExam = (req, res) => {
  let questionId = uuidv4();
  let q = `INSERT INTO Exams(ExamId, ChapterId, CourseId, QuestionContent, QuestionImg, QuestionType, QuestionAnswer, QuestionOptions, IsDeleted, LastModificationTime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, false, NOW())`;
  const questionContent = question.questionTitle || "";
  const questionImg = question.questionImg;
  const questionType = question.questionType || "";
  const questionAnswer = question.questionAnswer || "";
  const questionOptions = JSON.stringify(question.optionsAnswer) || "";
  db.query(
    q,
    [
      questionId,
      chapterId,
      courseId,
      questionContent,
      questionImg,
      questionType,
      questionAnswer,
      questionOptions,
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
