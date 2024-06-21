import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ViewAEditDropdown from "../../../../../components/Dropdowns/ViewAEditDropdown";
import { formatDateString } from "../../../../../js/TAROHelper";
function ExamView() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [exams, setExams] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/api/questions/exams/${courseId}`);
      setExams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="py-3 px-5 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-200 hover:cursor-pointer opacity-85 hover:opacity-100 rounded-md"
          onClick={goBack}
        >
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
        <button className="bg-blue-700 text-sm rounded-md font-semibold text-white py-2 px-3">
          Add Exam
        </button>
      </div>
      <div className="flex-grow mt-3">
        <div>
          <div className="grid grid-cols-3 gap-8">
            {exams.map((exam, index) => (
              <div
                key={index}
                className="h-max border border-slate-200 rounded-md"
              >
                <div className="h-[40%] border-b border-slate-200 rounded-t-md bg-slate-50 px-3">
                  <div className="h-full py-3 flex justify-between items-center">
                    <div className="flex justify-center items-center gap-6">
                      <img
                        className="w-12 h-12 cover-fill rounded-xl"
                        src="https://res.cloudinary.com/ddwapzxdc/image/upload/v1712303849/CourseImage/llsmb5ccnjtjnf60zwbr.jpg"
                        alt=""
                      />
                      <span className="truncate font-semibold text-gray-900">
                        {exam?.ExamTitle}
                      </span>
                    </div>
                    <div>
                      <ViewAEditDropdown examId={exam.ExamId} />
                    </div>
                  </div>
                </div>
                <div className="h-[60%] px-3">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span>Start time</span>
                    <span>{formatDateString(exam?.TimeStart)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span>Time limit</span>
                    <span>{exam?.TimeLimit} Minutes</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span>Question number</span>
                    <span>{exam?.QuestionCount} </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span>Status</span>
                    <div>
                      {exam?.Status ? (
                        <span className="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                          Is Active
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-yellow-600/20">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamView;
