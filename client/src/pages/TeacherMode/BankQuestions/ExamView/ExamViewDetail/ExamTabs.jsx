import React from "react";

function ExamTabs({
  time,
  questions,
  activeTab,
  flaggedQuestions,
  handleTabClick,
  answers,
}) {
  const generateTabs = () => {
    return questions.map((question, index) => {
      const answered = answers.find(
        (answer) => answer.questionId === question.QuestionId
      );
      return (
        <li
          key={index}
          className={`rounded-md border border-blue-500 text-black flex ${
            answered && "bg-green-700 text-white border-slate-200"
          } ${activeTab === index + 1 && "bg-blue-600 text-white"}`}
        >
          <button
            className="inline-flex items-center justify-center flex-grow px-1 py-2 rounded-md hover:text-gray-900 hover:outline-blue-600 hover:outline"
            onClick={() => handleTabClick(question.QuestionId, index)}
          >
            {flaggedQuestions.includes(question.QuestionId) && (
              <span className="mr-1">🚩</span>
            )}
            {(index + 1).toString()}
          </button>
        </li>
      );
    });
  };
  return (
    <div className="w-[20%]">
      <div className="sticky top-16  ">
        <ul className="grid border mb-6 rounded-md border-blue-500 py-3 px-4 grid-cols-5 gap-2 text-sm font-medium text-center text-gray-500">
          {generateTabs()}
        </ul>
        <p className="font-semibold  w-full text-xl text-center">
          <span className=" px-4 py-3 rounded-md border border-blue-500 ">
            {Math.floor(time / 60)
              .toString()
              .padStart(2, "0")}
            {" : "}
            {(time % 60).toString().padStart(2, "0")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default ExamTabs;
