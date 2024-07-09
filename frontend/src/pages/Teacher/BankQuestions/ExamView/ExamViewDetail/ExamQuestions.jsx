import React, { useEffect } from "react";

function ExamQuestions({
  questions,
  toggleFlag,
  flaggedQuestions,
  answers,
  setAnswers,
}) {
  useEffect(() => {}, [answers]);

  const handleAnswerChange = (questionId, optionId, isMultipleChoice) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find(
        (answer) => answer.questionId === questionId
      );

      if (existingAnswer) {
        if (isMultipleChoice) {
          const updatedAnswerId = existingAnswer.answerId.includes(optionId)
            ? existingAnswer.answerId.filter((id) => id !== optionId)
            : [...existingAnswer.answerId, optionId];

          return prevAnswers?.map((answer) =>
            answer.questionId === questionId
              ? { ...answer, answerId: updatedAnswerId }
              : answer
          );
        } else {
          return prevAnswers?.map((answer) =>
            answer.questionId === questionId
              ? { ...answer, answerId: [optionId] }
              : answer
          );
        }
      } else {
        return [...prevAnswers, { questionId, answerId: [optionId] }];
      }
    });
  };

  return (
    <div className="w-[80%] px-10">
      <div className="text-3xl text-blue-700 font-semibold py-1">
        The Data Science Course: Complete Data Science Bootcamp 2023
      </div>
      <div className="mt-5">
        {questions?.map((question, index) => {
          const isFlagged = flaggedQuestions.includes(question.QuestionId);
          const selectedAnswers = answers.find(
            (answer) => answer.questionId === question.QuestionId
          )?.answerId || [];

          return (
            <ul
              id={question?.QuestionId}
              className="my-4 pb-8 border-b border-slate-300"
              key={index}
            >
              <div className="cau-hoi">
                <div className="flex justify-between items-center">
                  <span className="text-green-500 font-semibold ">
                    Câu {index + 1}
                  </span>
                  <span
                    className="px-3 py-1 rounded-md hover:bg-slate-200 hover:text-blue-700 text-blue-500 decoration-solid underline  font-medium"
                    onClick={() => toggleFlag(question.QuestionId)}
                  >
                    {isFlagged ? "Unflag" : "Flag"}
                  </span>
                </div>
                <h3 className="font-semibold my-3">
                  {question?.QuestionContent}
                </h3>
                {question?.QuestionImg && (
                  <div className="flex justify-center items-center my-3">
                    <img
                      src={question?.QuestionImg}
                      alt=""
                      style={{ width: "50%", height: "auto" }}
                    />
                  </div>
                )}
                <ul className="mt-6 grid grid-cols-2 gap-4">
                  {question?.QuestionOptions?.map((item, idx) => (
                    <li key={idx}>
                      <label
                        htmlFor={question?.QuestionId + item.id}
                        className="block relative"
                      >
                        <input
                          id={question?.QuestionId + item.id}
                          type={
                            question?.QuestionType === "Single Choice"
                              ? "radio"
                              : "checkbox"
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              question.QuestionId,
                              item.id,
                              question.QuestionType === "Multiple Choice"
                            )
                          }
                          name={`question-${question?.QuestionId}`}
                          checked={selectedAnswers.includes(item.id)}
                          className="sr-only peer"
                        />
                        <div className="w-full p-3 cursor-pointer rounded-lg border border-slate-300 bg-white shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                          <div className="pl-7">
                            <h3 className="mt-0.5 text-gray-800 font-medium">
                              {item?.optionTitle}
                            </h3>
                            <div className="flex justify-center items-center">
                              <img
                                className="w-auto max-h-48"
                                src={item?.optionImg}
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <span
                          className={`block absolute top-5 left-5 border peer-checked:border-[5px] peer-checked:border-indigo-600 w-4 h-4 
        ${question?.QuestionType === "Single Choice" ? "rounded-full" : ""}`}
                        ></span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </ul>
          );
        })}
      </div>
    </div>
  );
}

export default ExamQuestions;
