import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { scroller } from "react-scroll";
import { AuthContext } from "@/context/authContext";
import ExamTabs from "./ExamTabs";
import ExamQuestions from "./ExamQuestions";

function ExamViewDetail() {
  const { flaggedQuestions, setFlaggedQuestions } = useContext(AuthContext);

  const { examId } = useParams();
  const [activeTab, setActiveTab] = useState(1);
  const [time, setTime] = useState(3600); // Adjust initial time as needed
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const componentRef = useRef(null);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("examQuestions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }
  }, []);

  const handleTabClick = (questionId, index) => {
    setActiveTab(index + 1);
    scroller.scrollTo(questionId, {
      duration: 500,
      smooth: "easeInOutQuart",
    });
  };

  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prevFlags) => {
      if (prevFlags.includes(questionId)) {
        return prevFlags.filter((id) => id !== questionId);
      } else {
        return [...prevFlags, questionId];
      }
    });
  };

  const handleFormSubmit = () => {
    console.table(answers);
  };

  return (
    <div ref={componentRef} className="flex py-5 flex-col px-5">
      <div className="">
        <div className="flex  justify-between items-center border-b pb-3 border-slate-200">
          <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:cursor-pointer opacity-85 hover:opacity-100 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            <span className="text-gray-900 text-sm font-medium opacity-85">
              Quay lại
            </span>
          </div>
        </div>
      </div>

      <div className="flex mt-3 gap-4 ">
        <ExamTabs
          time={time}
          questions={questions}
          activeTab={activeTab}
          flaggedQuestions={flaggedQuestions}
          handleTabClick={handleTabClick}
          answers={answers}
        />
        <ExamQuestions
          questions={questions}
          toggleFlag={toggleFlag}
          flaggedQuestions={flaggedQuestions}
          setAnswers={setAnswers}
          answers={answers}
        />
      </div>
    </div>
  );
}

export default ExamViewDetail;
