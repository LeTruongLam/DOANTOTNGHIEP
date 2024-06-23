import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
export default function BankQuestions() {
  const { courses, fetchCourses } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleEdit = async (courseId) => {
    navigate(`/teacher/courses/${courseId}/bankquestions`);
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="px-5 h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="flex justify-between items-center">
        <span className="text-3xl font-bold">Ngân hàng câu hỏi</span>
        <div className="my-4 flex gap-3 ">
          <input
            type="text"
            name="search-course"
            id="search-course"
            autoComplete="given-name"
            placeholder="Search course"
            className=" outline-none block w-80 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course?.CourseId}
            className="bg-slate-50 hover:cursor-pointer h-20 flex border border-gray-50 rounded-lg overflow-hidden shadow"
            onClick={() => handleEdit(course?.CourseId)}
          >
            <div className=" flex items-center justify-center bg-slate-500 flex-shrink-0">
              <img className="w-20 h-full object-cover" src={course?.img} />
            </div>
            <div className="flex items-center justify-between flex-grow">
              <div className="flex flex-col py-2 px-4">
                <p className="text-gray-800 font-medium line-clamp-1">
                  {course.title}
                </p>
                <p className="text-gray-700 font-semibold text-sm">
                  {course.CourseCode}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
