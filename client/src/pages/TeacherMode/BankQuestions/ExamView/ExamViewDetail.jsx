import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { scroller } from "react-scroll";

function ExamViewDetail() {
  const { examId } = useParams();

  const [activeTab, setActiveTab] = useState(1);
  const [time, setTime] = useState(3600);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  const componentRef = useRef(null); // Reference to the main component's DOM element

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/questions/exam/${examId}`);
        setQuestions(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [examId]);

  useEffect(() => {
    let timer = null;
    if (time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [time]);

  // Event listeners to prevent copying
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Disable Ctrl+C, Ctrl+V, Ctrl+U, F12
      if (
        (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85)) ||
        e.keyCode === 123
      ) {
        e.preventDefault();
      }
    };

    const element = componentRef.current;
    element.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleTabClick = (questionId) => {
    setSelectedQuestionId(questionId);
    scroller.scrollTo(questionId, {
      duration: 500,
      smooth: "easeInOutQuart",
    });
  };

  const generateTabs = () => {
    return questions.map((question, index) => (
      <li
        key={index}
        className={`rounded-md border border-blue-500 flex ${
          selectedQuestionId === question.QuestionId ? "text-white bg-blue-600" : ""
        }`}
      >
        <button
          className="inline-flex items-center justify-center flex-grow px-1 py-2 rounded-md hover:text-gray-900 hover:outline-blue-600 hover:outline"
          onClick={() => handleTabClick(question.QuestionId)}
        >
          {(index + 1).toString()}
        </button>
      </li>
    ));
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
              Back
            </span>
          </div>
          <div className="flex justify-center items-center gap-4">
            <button className="bg-blue-700 text-sm rounded-md font-semibold text-white py-2 px-3">
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="flex mt-3 gap-4 ">
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
        <div className="w-[80%] px-10">
          <div className="text-3xl text-blue-700 font-semibold py-1">
            The Data Science Course: Complete Data Science Bootcamp 2023
          </div>
          <div className="mt-5">
            {questions.map((question, index) => (
              <ul id={question?.QuestionId} className="my-4" key={index}>
                <div className="cau-hoi">
                  <span className="text-green-500 font-semibold">
                    # {question?.QuestionId}
                  </span>
                  <h3 className={`font-semibold my-3 ${selectedQuestionId === question.QuestionId ? "bg-yellow-300" : ""}`}>
                    {question?.QuestionContent}
                  </h3>
                  <div className="flex justify-center items-center my-3">
                    <img
                      src={question?.QuestionImg}
                      alt=""
                      style={{ width: "50%", height: "auto" }}
                    />
                  </div>
                  <ul className="mt-6 grid grid-cols-2 gap-4">
                    {question?.QuestionOptions.map((item, idx) => (
                      <li key={idx}>
                        <label
                          htmlFor={question?.QuestionId + item.id}
                          className="block relative"
                        >
                          <input
                            id={question?.QuestionId + item.id}
                            type="radio"
                            name="payment"
                            className="sr-only peer"
                          />
                          <div className="w-full p-3 cursor-pointer rounded-lg  border border-slate-300 bg-white shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                            <div className="pl-7">
                              <h3 className="mt-0.5 text-gray-800 font-medium">
                                {item?.optionTitle}
                              </h3>
                              <div className="flex justify-center items-center">
                                <img
                                  className=" w-auto max-h-48 "
                                  src={item?.optionImg}
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                          <span className="block absolute top-5 left-5 border peer-checked:border-[5px] peer-checked:border-indigo-600 w-4 h-4 rounded-full"></span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamViewDetail;