import React, { Fragment, useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SignleChoice from "../../../../img/single-choice.png";
import MultipleChoice from "../../../../img/multiple.png";

function StepperFirst({
  questions,
  setQuestions,
  questionTitle,
  setQuestionTitle,
  questionType,
  setQuestionType,
  optionsAnswer,
  setOptionsAnswer,
}) {
  return (
    <div>
      <div className="bg-slate-100 px-5 py-3">
        <div className="my-5">
          <ul>
            {questions.map((question) => (
              <li
                key={question.id}
                className="px-3 w-full flex py-2 my-2 bg-white border-blue-500 border  rounded-md"
              >
                <span>{question?.questionTitle}</span>
                {/* <img className="h-10 w-14" src={question?.questionImg} alt="" /> */}
                <span>{question?.questionType}</span>
              </li>
            ))}
          </ul>
          <div className="flex w-max items-center gap-1 px-2 py-1 border rounded-md hover:cursor-pointer border-blue-600		">
            <AddBoxIcon style={{ color: "rgb(37 99 235)" }} />
            <span className="text-sm font-medium">Add Quiz</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepperFirst;
