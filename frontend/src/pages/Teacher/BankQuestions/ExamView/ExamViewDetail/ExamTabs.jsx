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
    return questions?.map((question, index) => {
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
          <span
            className="inline-flex items-center justify-center flex-grow px-1 py-2 rounded-md  hover:outline-blue-600 hover:outline"
            onClick={() => handleTabClick(question.QuestionId, index)}
          >
            {flaggedQuestions.includes(question.QuestionId) && <span>🚩</span>}
            {(index + 1).toString()}
          </span>
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
      </div>
    </div>
  );
}

export default ExamTabs;
