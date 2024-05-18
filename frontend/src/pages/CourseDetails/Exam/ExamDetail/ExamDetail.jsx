import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { scroller } from "react-scroll";
import { AuthContext } from "../../../../context/authContext";
import ExamTabs from "./ExamTabs";
import ExamQuestions from "./ExamQuestions";
import { XMarkIcon } from "@heroicons/react/20/solid";

function ExamDetail() {
  const { flaggedQuestions, setFlaggedQuestions } = useContext(AuthContext);

  const { examId } = useParams();
  const [activeTab, setActiveTab] = useState(1);
  const [time, setTime] = useState(3600); // Adjust initial time as needed
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const componentRef = useRef(null);
  const fetchExamById = async (examId) => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/questions/exam/${examId}`
      );
      setQuestions(response.data.questions);
      localStorage.setItem(
        "examQuestions",
        JSON.stringify(response.data.questions)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExamById(examId);
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

  const handleFormSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:8800/api/questions/exam/${examId}/results`,
        { answers: answers },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );

      const score = response.data;
      // Xử lý kết quả điểm số tại đây (ví dụ: hiển thị thông báo, chuyển hướng trang, etc.)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div ref={componentRef} className="flex pb-5 flex-col px-5">
      <div className="">
        <div className="sticky isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div
            className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div
            className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm leading-6 text-gray-900">
              <strong className="font-semibold">GeneriCon 2023</strong>
              <svg
                viewBox="0 0 2 2"
                className="mx-2 inline h-0.5 w-0.5 fill-current"
                aria-hidden="true"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              Join us in Denver from June 7 – 9 to see what’s coming next.
            </p>
            <a
              onClick={handleFormSubmit}
              className="flex-none rounded-full bg-blue-600 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:text-white "
            >
              Submit now <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          <div className="flex flex-1 justify-end">
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
          </div>
        </div>
      </div>

      <div className="flex mt-10 gap-4 ">
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

export default ExamDetail;
