import React from "react";

function ExamView() {
  return (
    <div className="py-3 px-5 h-full flex flex-col ">
      <div className="flex justify-between items-center">
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
        <button className="bg-blue-700 text-sm rounded-md font-semibold text-white py-2 px-3">
          Add Exam
        </button>
      </div>
      <div className="flex-grow mt-3">
        <div>
          <div className="grid grid-cols-3 gap-8">
            <div className="h-48 bg-gray-100 rounded-md flex justify-center items-center">
              01
            </div>
            <div className="h-48 bg-gray-100 rounded-md flex justify-center items-center">
              01
            </div>
            <div className="h-48 bg-gray-100 rounded-md flex justify-center items-center">
              01
            </div>
            <div className="h-48 bg-gray-100 rounded-md flex justify-center items-center">
              01
            </div>
            <div className="h-48 bg-gray-100 rounded-md flex justify-center items-center">
              01
            </div>
            <div className="h-48 bg-gray-100 rounded-md flex justify-center items-center">
              01
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamView;
