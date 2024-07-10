import { X } from "lucide-react";
import React from "react";

function QuestionsList({ questions, setQuestions, setQuestionIds }) {
  const handleRemoveQuestion = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.QuestionId !== questionId)
    );
    setQuestionIds((prevIds) => prevIds.filter((id) => id !== questionId));
  };

  return (
    <div className="mt-4">
      <label
        htmlFor="about"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Danh sách câu hỏi
      </label>
      {questions.map((question) => (
        <li
          key={question.QuestionId}
          className="px-3 h-11 w-full flex justify-between items-center py-2 my-2 bg-white border-blue-500 border rounded-md"
        >
          <div className="truncate flex-1">
            <span>{question?.QuestionContent}</span>
          </div>
          <div className="flex flex-1 gap-4 justify-end items-center">
            {question?.QuestionType === "Single Choice" && (
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="#16A34A"
                className="bi bi-check2-circle"
              >
                <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
              </svg>
            )}
            {question?.QuestionType === "Multiple Choice" && (
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="#16A34A"
                className="bi bi-check2-square"
              >
                <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z" />
                <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
              </svg>
            )}
            <div
              className="hover:cursor-pointer"
              onClick={() => handleRemoveQuestion(question.QuestionId)}
            >
              <X className="w-5 h-5" />
            </div>
          </div>
        </li>
      ))}
    </div>
  );
}

export default QuestionsList;
