import { db } from "../../db.js";
import { v4 as uuidv4 } from "uuid";

export const addListQuestion = (req, res, next) => {
  const courseId = req.params.courseId;
  const chapterId = req.body.chapterId;
  const questions = req.body.questions;

  const promises = questions.map((question) => {
    return new Promise((resolve, reject) => {
      let questionId = uuidv4();
      let q = `INSERT INTO questions(QuestionId, ChapterId, CourseId, QuestionContent, QuestionImg, QuestionType, QuestionAnswer, QuestionOptions, IsDeleted, LastModificationTime)
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
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  });

  Promise.all(promises)
    .then(() => {
      console.log("Thêm câu hỏi thành công");
      res.status(200).json({ message: "Questions added successfully." });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
export const getListQuestionByChapterId = (req, res) => {
  const chapterId = req.params.chapterId;
  const query = `
    SELECT *
    FROM questions
    WHERE ChapterId = ?
  `;
  db.query(query, [chapterId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
    const questions = data.length === 0 ? [] : data;
    return res.status(200).json(questions);
  });
};
export const deleteListQuestion = (req, res) => {
  const questionIds = req.body.selectedIds;
  const query = `
    DELETE FROM questions
    WHERE QuestionId IN (?)
  `;
  db.query(query, [questionIds], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
    return res.status(200).json({ message: "Questions deleted successfully." });
  });
};
export const getQuestionById = (req, res) => {
  const questionId = req.params.questionId;
  const query = `
    SELECT *
    FROM questions
    WHERE QuestionId = ?
  `;
  db.query(query, [questionId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Question not found." });
    }
    const question = data[0];
    return res.status(200).json(question);
  });
};

export const updateQuestion = (req, res) => {
  const {
    questionContent,
    questionImg = "",
    questionType,
    questionAnswer = "",
    questionOptions,
  } = req.body;
  const questionId = req.params.questionId;

  const query = `
    UPDATE questions
    SET QuestionContent = ?,
        QuestionImg = ?,
        QuestionType = ?,
        QuestionAnswer = ?,
        QuestionOptions = ?,
        LastModificationTime = NOW()
    WHERE QuestionId = ?
  `;

  db.query(
    query,
    [
      questionContent,
      questionImg,
      questionType,
      questionAnswer,
      JSON.stringify(questionOptions),
      questionId,
    ],
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "An unexpected error occurred." });
      }
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: "Question not found." });
      }
      return res
        .status(200)
        .json({ message: "Question updated successfully." });
    }
  );
};
